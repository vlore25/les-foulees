"server-only"

import {SignJWT, jwtVerify} from 'jose' 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("La variable d'environnement JWT_SECRET n'est pas définie !");
}
const secretKey = new TextEncoder().encode(secret);


type SessionPayload = {
  userId: string
  expiresAt: Date
}

type Token = {
  token: String
}

const cookie = {
  name: 'lesFoulees',
  options: { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'lax' as const, 
    path: '/' 
  },
  duration: 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: SessionPayload){
    return new SignJWT(payload)
      .setProtectedHeader({alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime("1 day")
      .sign(secretKey)
}

export async function decrypt(session: string | undefined = ''){
  try{
    const {payload} = await jwtVerify(session, secretKey, {
      algorithms: ['HS256']
    })
    return payload;
  }catch (error){
    return null;
  }
  
}

export async function createSession(userId: string){

  const expiresAt = new Date(Date.now() + cookie.duration)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(cookie.name, session, {...cookie.options, expires: expiresAt})

}

export const getSession = cache(async () => {
  const cookie = (await cookies()).get('lesFoulees')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    return null
  }

  return { isAuth: true, userId: session.userId as string }
})

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('lesFoulees')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
  return { isAuth: true, userId: session.userId as string }
})

export async function deleteSession() {

  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}