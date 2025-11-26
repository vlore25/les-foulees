'use server'

import { getSession } from '@/lib/auth'
import { registerFormSchema, RegisterFormState, loginSchema } from '@/lib/definitions'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'



export async function registerUser(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {

  const validatedFields = registerFormSchema.safeParse(Object.fromEntries(formData.entries()))

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Account.',
    }
  }

  const { name, lastname, email, password } = validatedFields.data
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { message: 'An account with this email already exists.' }
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
      message: 'Database Error: Failed to Create Account.',
    }
  }

  redirect('/auth/login')
}

export type LoginState = {
  error?: string
}
export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: 'Invalid email or password' }
  }

  const user = await prisma.user.findUnique({
    where: { email: result.data.email }
  })

  if (!user) {
    return { error: 'User not found' }
  }

  const passwordMatch = await bcrypt.compare(result.data.password, user.password)

  if (!passwordMatch) {
    return { error: 'Wrong password' }
  }

  const session = await getSession()
  session.userId = user.id
  session.email = user.email
  session.isLoggedIn = true
  await session.save() 

  redirect('/dashboard')
}

export async function logout() {
  const session = await getSession()
  session.destroy() // ← Supprime le cookie
  redirect('/auth/login')
}