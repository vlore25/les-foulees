import 'server-only';

import { AdminUserDTO, CurrentUser, toAdminDTO, toPublicListDTO, UserDTO } from "@/src/lib/dto"
import { prisma } from "@/src/lib/prisma"
import { getSession, verifySession } from "@/src/lib/session"
import { cache } from "react"

export const isUserAdmin = async (): Promise<boolean> => {

  const session = await verifySession();
  if (!session?.userId) return false;

  const currentUser = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { role: true }
  });
  return currentUser?.role === 'ADMIN';
};


// Retrieve all users
export const getAllUsers = cache(async (): Promise<UserDTO[]> => {
  const session = await verifySession()

  let isAdmin = false

  if (session?.userId) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: { role: true }
    })
    isAdmin = currentUser?.role === 'ADMIN'
  }

  const users = await prisma.user.findMany({
    orderBy: { lastname: 'asc' }
  });

  if (isAdmin) {
    return users.map(toAdminDTO)
  } else {
    return users.map(toPublicListDTO)
  }
})


export const getUser = cache(async (userId: string): Promise<UserDTO | null> => {
  const isAdmin = await isUserAdmin();
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) return null;
  if (isAdmin) {
    return toAdminDTO(user);
  } else {
    return toPublicListDTO(user);
  }
});


export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
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


export async function searchPartnerByName(query: string) {
  if (query.length < 2) return [];

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { lastname: { contains: query, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 3
  });

  return users;
}

export async function getUsersCount(): Promise<number> {
  const count = await prisma.user.count({
    where: {
      status: "ACTIVE"
    },
  });

  return count;
}

