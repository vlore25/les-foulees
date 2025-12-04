'use server'

import { createSession, deleteSession } from '@/src/lib/session'
import { registerFormSchema, loginSchema } from '@/src/lib/definitions'
import { prisma } from '@/src/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'


export type RegisterFormState = {
  error?: {
    name?: string[];
    lastname?: String[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export type LoginFormState = {
  error?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;


//Register Logic
export async function registerUser(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {

  const token = formData.get('token') as string;
  const validatedFields = registerFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, lastname, email, password } = validatedFields.data;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return { message: 'Un compte est déjà associé cette adresse e-mail.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Transaction : Création User + Suppression Invitation
    await prisma.$transaction(async (tx) => {
        
        // 1. Créer l'utilisateur (Juste les champs que vous avez)
        await tx.user.create({
          data: {
            name,
            lastname,
            email,
            password: hashedPassword,
            // J'ai retiré emailVerified ici !
          },
        });

        // 2. Supprimer l'invitation
        if (token) {
            // On utilise deleteMany par sécurité (évite erreur si introuvable)
            await tx.invitation.deleteMany({
                where: { token: token }
            });
        } else {
             await tx.invitation.deleteMany({
                where: { email: email }
            });
        }
    });

  } 
  catch (e) {
    console.error("Erreur inscription:", e);
    return { message: 'Une erreur s\'est produite, veuillez réessayer.' };
  }

  return { message: 'Compte créé avec succès' };
}


//Login logic
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

  //Verify invitation token
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

  //Logout Logic
  export async function logout() {
    await deleteSession()
    redirect('/')
  }