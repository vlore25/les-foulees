import 'server-only';
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";

export const getAllPayments = cache(async () => {
  const payments = await prisma.payment.findMany({
    include: {
      user: {
        select: {
          name: true,
          lastname: true,
          email: true,
        }
      },
      memberships: {
        include: {
          season: {
            select: {
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return payments;
});

export const getPaymentById = cache(async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: true,
      memberships: true
    }
  });
  return payment;
});
