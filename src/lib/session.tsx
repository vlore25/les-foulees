"server-only"

import {SignJWT, jwtVerify} from 'jose' 
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import { encrypt, decrypt, SessionPayload } from './session-edge'

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


export const verifyValidatedMembership = cache(async () => {
  const cookieValue = (await cookies()).get(cookie.name)?.value
  const session = await decrypt(cookieValue)
 
  if (!session?.userId) {
    redirect('/login')
  }

  const { prisma } = await import('@/src/lib/prisma')
  
  // Vérifier le statut de l'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { status: true, role: true }
  })

  if (!user || user.status === 'INACTIVE') {
    redirect('/login')
  }

  // Les administrateurs ont toujours accès
  if (user.role === 'ADMIN') {
    return { isAuth: true, userId: session.userId as string }
  }

  // Chercher la saison correspondant à la date actuelle
  const now = new Date();
  const activeSeason = await prisma.season.findFirst({
    where: { 
      startDate: { lte: now },
      endDate: { gte: now }
    }
  })

  if (activeSeason) {
    // Vérifier si l'utilisateur a une adhésion validée pour cette saison
    const membership = await prisma.membership.findUnique({
      where: {
        userId_seasonId: {
          userId: session.userId as string,
          seasonId: activeSeason.id
        }
      }
    })

    if (!membership || membership.status !== 'VALIDATED') {
      redirect('/espace-membre/adhesion')
    }
  }

  return { isAuth: true, userId: session.userId as string }
})

export async function deleteSession() {

  const cookieStore = await cookies()
  cookieStore.delete(cookie.name)
}