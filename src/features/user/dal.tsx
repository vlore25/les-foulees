import { toAdminDTO, toPublicDTO, UserDTO } from "@/src/lib/dto";
import { prisma } from "@/src/lib/prisma";
import { getSession, verifySession } from "@/src/lib/session";
import { cache } from "react";

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

