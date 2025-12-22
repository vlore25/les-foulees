'use server'

import { createSession, deleteSession } from '@/src/lib/session'
import { registerFormSchema, loginSchema, emailSchema, newPasswordSchema } from '@/src/lib/definitions' // Assurez-vous que votre schema est bien exporté d'ici
import { prisma } from '@/src/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import z from 'zod'
import { SignJWT } from 'jose'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { RecoverPasswordTemplate } from '@/components/email-templates/RecoverPasswordTemplate'

const resend = new Resend(process.env.RESEND_API_KEY);
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("La variable d'environnement JWT_SECRET n'est pas définie !");
}

const secretKey = new TextEncoder().encode(secret);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';


export type RegisterFormState = {
  errors?: {
    name?: string[];
    lastname?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
    birthdate?: string[];
    address?: string[];
    zipCode?: string[];
    city?: string[];
    emergencyName?: string[];
    emergencyLastName?: string[];
    emergencyPhone?: string[];
    showPhoneDirectory: boolean;
    showEmailDirectory: boolean;
    terms: boolean;
  };
  fields?: Record<string, any>;
  message?: string | null;
  success?: boolean;
} | undefined;

export type LoginFormState = {
  error?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
} | undefined;

export type RecoveryFormState = {
  error?: {
    email?: string[];
  };
  message?: string | null;
  success?: boolean;
} | undefined;

export type ResetPasswordFormState = {
  error?: {
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string | null;
  success?: boolean;
} | undefined;


//===VERIFICATION TOKEN=====
export async function verifyInvitationToken(token: string) {
  if (!token || typeof token !== "string") return null;

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: token }
    });

    return invitation;
  } catch (error) {
    return null;
  }
}

export async function verifyRecoveryToken(token: string) {
  if (!token) return null;

  try {
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token: token }
    });

    return existingToken;
  } catch (error) {
    return null;
  }
}

//====REGISTER=====
export async function registerUser(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const token = formData.get('token') as string;

  if (!token) {
    return { message: "Token d'invitation manquant ou invalide." };
  }

  // 2. VERIFICATION DE SÉCURITÉ : On cherche l'invitation en BDD
  const invitation = await prisma.invitation.findUnique({
    where: { token: token },
  });

  if (!invitation) {
    return { message: "Cette invitation est invalide ou a expiré." };
  }

  const emailVerifie = invitation.email;

  const rawFormData = {
    token: formData.get('token'),
    name: formData.get('name'),
    lastname: formData.get('lastname'),
    phone: formData.get('phone'),
    birthdate: formData.get('birthdate'),
    address: formData.get('address'),
    zipCode: formData.get('zip-code'),
    city: formData.get('city'),
    emergencyName: formData.get('emergencyName'),
    emergencyLastName: formData.get('emergencyLastName'),
    emergencyPhone: formData.get('emergencyPhone'),
    showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
    showEmailDirectory: formData.get('showEmailDirectory') === 'on',
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    terms: formData.get('terms-conditions')=== 'on',
  }

  const validatedFields = registerFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      success: false,
      fields: rawFormData,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs dans le formulaire."
    };
  }

  const { confirmPassword, terms, ...userData } = validatedFields.data;


  const existingUser = await prisma.user.findUnique({ where: { email: emailVerifie } });
  if (existingUser) {
    return { message: 'Un compte existe déjà pour cet email.' };
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  try {
    await prisma.$transaction(async (tx) => {

      await tx.user.create({
        data: {
          ...userData,
          email: emailVerifie,
          password: hashedPassword,
        },
      });

      await tx.invitation.delete({
        where: { token: token }
      });
    });

    return { success: true, message: "Inscription réussie !" };

  }
  catch (e) {
    console.error("Erreur inscription:", e);
    return { message: 'Une erreur technique est survenue.' };
  }

}

//===LOGIN===== 
export async function loginUser(state: LoginFormState, formData: FormData): Promise<LoginFormState> {

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors
    }
  }

  const { email, password } = validatedFields.data
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      message: 'Courriel ou mot de passe incorrect.'
    }
  }

  await createSession(user.id)

  redirect('/espace-membre')
}

//===LOGOUT===== 
export async function logout() {
  await deleteSession()
  redirect('/')
}

//===PASSWORD-RESET=====
export async function sendPasswordResetEmail(state: RecoveryFormState, formData: FormData): Promise<RecoveryFormState> {

  const formObjectSchema = z.object({
    email: emailSchema,
  });

  const validatedField = formObjectSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedField.success) {
    return {
      error: z.flattenError(validatedField.error).fieldErrors
    };
  }

  const { email } = validatedField.data
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    // Log interne 
    console.log(`Tentative de reset pour email inconnu : ${email}`);
    return {
      success: true,
      message: "Si un compte existe avec cet email, un lien a été envoyé."
    };
  }

  try {
    await prisma.passwordResetToken.deleteMany({
      where: { email: email }
    });

    const token = await new SignJWT({ email: email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .sign(secretKey);

    const expires = new Date(new Date().getTime() + 3600 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    const recoverLink = `${APP_URL}/recuperation/changer-mot-de-passe?token=${token}`;
    const emailHtml = await render(<RecoverPasswordTemplate recoverLink={recoverLink} />);

    await resend.emails.send({
      from: 'Les Foulées Avrillaises <onboarding@resend.dev>',
      to: [email],
      subject: 'Mot de passe oublié',
      html: emailHtml,
    });

    return { success: true, message: "Demande pour réinitialiser le mot de passe envoyée!" };

  } catch (error) {
    console.error("Erreur reset password:", error);
    return { success: false, message: "Erreur technique lors de l'envoi." };
  }
}

export async function resetPassword(state: ResetPasswordFormState, formData: FormData): Promise<ResetPasswordFormState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = newPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Veuillez corriger les erreurs ci-dessous.",
      error: validatedFields.error.flatten().fieldErrors 
    };
  }

  const { password } = validatedFields.data;
  const token = formData.get("token");

  if (!token || typeof token !== "string") {
    return { success: false, message: "Lien invalide." };
  }

  try {
    // 1. Vérifier le token en base
    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
        return { success: false, message: "Token invalide ou expiré." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { success: false, message: "Le lien a expiré." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email: existingToken.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });

    return { success: true, message: "Mot de passe modifié avec succès !" };

  } catch (error) {
    return { success: false, message: "Une erreur serveur est survenue." };
  }
}




