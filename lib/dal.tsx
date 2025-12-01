import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { prisma } from './prisma'
import { toPublicDTO, toAdminDTO, type UserDTO } from './dto'

export type UserListEntry = {
  name: string;
  lastname: string;
};

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
 
  return { isAuth: true, userId: session.userId }
})


export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

// Retrieve user based on session
export const getCurrentUser = cache(async () => {
  const session = await verifySession();

  if (!session?.userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      lastname: true,
    },
  });

  return user;
});

// Retrieve all users
export const getAllUsers = cache(async (): Promise<UserDTO[]> => {
  // 1. Qui est là ?
  const session = await verifySession()

  // 2. On récupère le rôle réel depuis la DB pour être sûr à 100%
  // (Optionnel mais recommandé si le cookie peut être vieux)
  let isAdmin = false
  
  if (session?.userId) {
     const currentUser = await prisma.user.findUnique({
        where: { id: session.userId as string },
        select: { role: true }
     })
     isAdmin = currentUser?.role === 'ADMIN'
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      status: true,
      email: true, 
      role: true,  
    },
    orderBy: { lastname: 'asc' }
  });


  if (isAdmin) {

    return users.map(user => toAdminDTO(user))
  } else {
    // Sinon (User normal ou Anonyme), on utilise le mapper Public
    // Les champs 'email' et 'role' sont jetés à la poubelle ici
    return users.map(user => toPublicDTO(user))
  }
})