// app/actions/user.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

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