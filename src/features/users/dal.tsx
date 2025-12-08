import { toAdminDTO, toPublicDTO, UserDTO } from "@/src/lib/dto"
import { prisma } from "@/src/lib/prisma"
import { getSession, verifySession } from "@/src/lib/session"
import { cache } from "react"


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
    return users.map(user => toPublicDTO(user))
  }
})

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

// Retrieve user based on session
export const getCurrentUser = cache(async () => {
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

