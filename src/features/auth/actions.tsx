'use server'

import { createSession, deleteSession } from '@/src/lib/session'
import { registerFormSchema, loginSchema } from '@/src/lib/definitions' // Assurez-vous que votre schema est bien exporté d'ici
import { prisma } from '@/src/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'

export type RegisterFormState = {
  error?: {
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
  };
  message?: string | null;
} | undefined;

export type LoginFormState = {
  error?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
} | undefined;


// Register Logic
export async function registerUser(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  // 1. Récupérer le token
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
    address: formData.get('address'),
    zipCode: formData.get('zip-code'), 
    city: formData.get('city'),
    birthdate: formData.get('birthdate'), 
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const validatedFields = registerFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { confirmPassword, ...userData } = validatedFields.data;
  
  
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

  } 
  catch (e) {
    console.error("Erreur inscription:", e);
    return { message: 'Une erreur technique est survenue.' };
  }

  redirect('/auth/login')
}


// Login logic
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

    redirect('/dashboard')
}

// Verify invitation token
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

// Logout Logic
export async function logout() {
    await deleteSession()
    redirect('/')
}