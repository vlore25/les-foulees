// app/actions/user.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;


// Retrieve user based on session
export const getCurrentUser = cache(async () => {
  const session = await getSession();

  if (!session?.userId) {
    return null;
  }

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

const userListSelect = {
  name: true,
  lastname: true, 
} as const; 

export type UserListEntry = {
  name: string;
  lastname: string;
};

export const getAllUsers = cache(async (): Promise<UserListEntry[]> => {
  const users = await prisma.user.findMany({
    // Sélection explicite et directe des champs requis
    select: {
      name: true,
      lastname: true,
    },
  });

  // Assertion simple du type de retour
  return users as UserListEntry[];
})
