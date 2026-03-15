import 'server-only';

import { admindUserDetails, AdminUserDetails, AdminUserList, BaseUser, publicUserDetails, PublicUserDetails, PublicUserList, toAdminList, toPublicList } from "@/src/lib/dto"
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

//-----------PUBLIC-------------------
export const getAllUsersPublicList = cache(async (): Promise<PublicUserList[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      status: true,
    },
    orderBy: { lastname: 'asc' }
  });
  return users;
});

export const getUserDetailsPublic = cache(async (userId: string): Promise<PublicUserDetails | null> => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      status: "ACTIVE"
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      status: true,
      showEmailDirectory: true,
      showPhoneDirectory: true,
      phone: true,
      email: true,
      createdAt: true,
    }
  });

  if (!user) {
    return null;
  }
  return publicUserDetails(user)

});

//-----------ADMIN-------------------

export const getAllUsersAdminList = cache(async (): Promise<AdminUserList[]> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      status: true,
      createdAt: true
    },
    orderBy: { lastname: 'asc' }
  });
  return users.map(toAdminList);
});

export const getUserDetailsAdmin = cache(async (userId: string): Promise<AdminUserDetails | null> => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      lastname: true,
      birthdate: true,
      phone: true,
      email: true,
      address: true,
      zipCode: true,
      city: true,
      status: true,
      showPhoneDirectory: true,
      showEmailDirectory: true,
      emergencyName: true,
      emergencyLastName: true,
      emergencyPhone: true,
      role: true,
      createdAt: true

    }
  });

  if (!user) return null;

  return admindUserDetails(user);

});


export const getCurrentUser = cache(async (): Promise<BaseUser | null> => {
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

