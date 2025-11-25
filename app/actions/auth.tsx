'use server'

import { getSession } from '@/lib/auth'
import { registerFormSchema, RegisterFormState, loginSchema } from '@/lib/definitions'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'



export async function registerUser(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  // 1. Validate form fields
  const validatedFields = registerFormSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Account.',
    }
  }

  // 3. Insert the user into the database or call an Auth Library's API
  const { name, lastname, email, password } = validatedFields.data
  console.log(name, lastname, email, password)

  // Check if user already exists
  const existingUser = await prisma.user.findUniqueOrThrow({
    where: { email }
  })

  if (existingUser) {
    return {
      message: 'This email is already registered.'
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user using PRISMA
  try {
    await prisma.user.create({
      data: {
        name,
        lastname, // Required by your schema
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Account.',
    }
  }

}

export type LoginState = {
  error?: string
}
export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // 1. Valider les données
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: 'Invalid email or password' }
  }

  // 2. Chercher l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: result.data.email }
  })

  if (!user) {
    return { error: 'User not found' }
  }

  // 3. Vérifier le mot de passe
  const passwordMatch = await bcrypt.compare(result.data.password, user.password)

  if (!passwordMatch) {
    return { error: 'Wrong password' }
  }

  // 4. CRÉER LA SESSION (le cookie est créé ici!)
  const session = await getSession()
  session.userId = user.id
  session.email = user.email
  session.isLoggedIn = true
  await session.save() // ← C'est ici que le cookie est créé et envoyé!

  // 5. Rediriger vers le dashboard
  redirect('/dashboard')
}

export async function logout() {
  const session = await getSession()
  session.destroy() // ← Supprime le cookie
  redirect('/auth/login')
}