"server-only"

import {SignJWT, jwtVerify} from 'jose' 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET manquant");
  return new TextEncoder().encode(secret);
}


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
    secure: false, 
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
      .sign(getSecretKey())
}

export async function decrypt(session: string | undefined = ''){
  try{
    const {payload} = await jwtVerify(session, getSecretKey(), {
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
  const cookieValue = (await cookies()).get(cookie.name)?.value
  const session = await decrypt(cookieValue)

  if (!session?.userId) {
    return null
  }

  // Vérifier le statut de l'utilisateur en base
  const { prisma } = await import('@/src/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { status: true }
  })

  if (!user || user.status === 'INACTIVE') {
    return null
  }

  return { isAuth: true, userId: session.userId as string }
})

export const verifySession = cache(async () => {
  const cookieValue = (await cookies()).get(cookie.name)?.value
  const session = await decrypt(cookieValue)
 
  if (!session?.userId) {
    redirect('/login')
  }

  // Vérifier le statut de l'utilisateur en base
  const { prisma } = await import('@/src/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { status: true }
  })

  if (!user || user.status === 'INACTIVE') {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId as string }
})

export const verifySessionExternal = cache(async () => {
  const cookieValue = (await cookies()).get(cookie.name)?.value
  const session = await decrypt(cookieValue)
 
  if (!session?.userId) {
    return { isAuth: false, userId: "" }
  }

  // Vérifier le statut de l'utilisateur en base
  const { prisma } = await import('@/src/lib/prisma')
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { status: true }
  })

  if (!user || user.status === 'INACTIVE') {
    return { isAuth: false, userId: "" }
  }

  return { isAuth: true, userId: session.userId as string }
})


export async function deleteSession() {

  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}