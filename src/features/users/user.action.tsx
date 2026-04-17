"use server"
import * as React from 'react';
import { InviteUser } from "@/components/email-templates/InviteUserTemplate";
import { inviteSchema, InviteUserState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { SignJWT } from 'jose';
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { getSession } from "../../lib/session";
import { getProfile } from '../account/dal';

/**
 * Helper pour vérifier si l'utilisateur est admin
 */
async function verifyAdmin() {
    const session = await getSession();
    if (!session?.userId) return false;
    const user = await getProfile(session.userId);
    return user?.role === 'ADMIN';
}

export async function searchPartnerByName(query: string) {
  const session = await getSession();
  if (!session?.userId) return [];

  // Nettoyage de la requête : suppression des caractères spéciaux et espaces superflus
  const cleanQuery = query.replace(/[^\w\s@.]/gi, '').trim();
  if (!cleanQuery) return [];

  const searchTerms = cleanQuery.split(/\s+/).filter(term => term.length > 0);

  const users = await prisma.user.findMany({
    where: {
      id: { not: session.userId },
      status: 'ACTIVE',
      AND: searchTerms.map(term => ({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { lastname: { contains: term, mode: 'insensitive' } },
          { email: { contains: term, mode: 'insensitive' } },
        ],
      })),
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
    },
    take: 5,
  });

  return users.map(u => ({
    id: u.id,
    name: `${u.name} ${u.lastname}`,
    email: u.email
  }));
}

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("La variable d'environnement JWT_SECRET n'est pas définie !");
}

const secretKey = new TextEncoder().encode(secret);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendInviteAction(prevState: InviteUserState, formData: FormData): Promise<InviteUserState> {
  if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

  const validatedFields = inviteSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Veuillez corriger les erreurs.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      success: false,
      message: 'Un compte est déjà associé à cette adresse e-mail.'
    };
  }

  try {
    const token = await new SignJWT({ email: email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .sign(secretKey);

    await prisma.invitation.upsert({
      where: { email },
      update: { token, createdAt: new Date() },
      create: {
        email,
        token
      },
    });

    const invitationLink = `${APP_URL}/inscription?token=${token}`;
    const emailHtml = await render(<InviteUser InvitationLink={invitationLink} />);

    await resend.emails.send({
      from: 'Les Foulées Avrillaises <onboarding@resend.dev>',
      to: [email],
      subject: 'Invitation à rejoindre les Foulées Avrillaises',
      html: emailHtml,
    });

    return { 
      success: true, 
      message: `Invitation envoyée avec succès à ${email}`,
    };

  } catch (error) {
    console.log(error)
    return { success: false, message: "Erreur technique lors de l'envoi." };
  }
}

export async function statusUserAction(userId: string) {
  if (!await verifyAdmin()) return { success: false, error: "Action non autorisée." };

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true }, 
    });

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"; //

    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath(`/admin/utilisateurs/${userId}`); 

    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    return { success: false, error: "Impossible de modifier le statut" };
  }
}

export async function getUserDetailsAction(userId: string) {
  try {
    const { getUserDetailsPublic } = await import("./dal");
    return await getUserDetailsPublic(userId);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails:", error);
    return null;
  }
}

export async function deleteUserAction(userId: string) {
  if (!await verifyAdmin()) return;

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/users");
}