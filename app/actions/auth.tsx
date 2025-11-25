import { getSession } from '@/lib/auth'
import { registerFormSchema, loginSchema } from '@/lib/definitions'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'


export async function registerUser(state: RegisterFormState, formData: FormData) {
  // 1. Validate form fields
  const validatedFields = registerSchema.safeParse(Object.fromEntries(formData.entries()))
 
  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)
 
  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })
 
  const user = data[0]
 
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }
 
}

export async function loginUser(prevState: State, formData: FormData): Promise<State> {
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