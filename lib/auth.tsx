import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  userId?: string
  email?: string
  isLoggedIn: boolean
}

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), {
    password: process.env.SESSION_SECRET!, // Min 32 caractères
    cookieName: 'app-session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/'
    }
  })
  
  return session
}