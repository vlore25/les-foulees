'use server'

import { createSession, deleteSession } from '@/lib/session'
import { registerFormSchema, loginSchema } from '@/lib/definitions'
import { prisma } from '@/lib/prisma'
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

  const validatedFields = registerFormSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return { 
      error: validatedFields.error.flatten().fieldErrors 
    }
  }

  const { name, lastname, email, password } = validatedFields.data
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { message: 'Un compte est déjà associé cette adresse e-mail.' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        lastname,
        email,
        password: hashedPassword,
      },
    })
  } catch (e) {
    console.error(e)
    return {
      message: 'A erreur s"est produit, veuillez reesayer.',
    }
  }
  return{
    message: 'Compte créé avec succés'
  }
}


//Login logic
export async function loginUser(state: LoginFormState, formData: FormData): Promise<LoginFormState> {

  const validatedFields = loginSchema.safeParse({ 
    email : formData.get('email'),
    password: formData.get('password'),

  })

  if (!validatedFields.success) {
    return { 
      error: validatedFields.error.flatten().fieldErrors 
    }
  }
  
  const {email, password} = validatedFields.data
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

//Logout Logic
export async function logout() {
  await deleteSession()
  redirect('/')
}