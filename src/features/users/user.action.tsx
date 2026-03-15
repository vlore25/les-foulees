"use server"
import * as React from 'react';
import { InviteUser } from "@/components/email-templates/InviteUserTemplate";
import { inviteSchema, InviteUserState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { SignJWT } from 'jose';
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("La variable d'environnement JWT_SECRET n'est pas définie !");
}

const secretKey = new TextEncoder().encode(secret);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendInviteAction(prevState: InviteUserState, formData: FormData): Promise<InviteUserState> {

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

export async function deleteUserAction(userId: string) {
  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/users");
}