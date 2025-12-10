import 'server-only';
import { prisma } from '@/src/lib/prisma';
import { cache } from 'react';

// On utilise 'cache' de React pour dédupliquer les requêtes si appelé plusieurs fois dans la même page
export const getProfile = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      phone: true,
      birthdate: true,
      address: true, 
      zipCode: true,
      city: true,
      emergencyName: true,
      emergencyLastName: true,
      emergencyPhone: true,
      role: true,
      createdAt: true,
      licenses: {
        where: {
          season: {
            isActive: true
          }
        },
        select: {
          id: true,
          type: true,
          licenseNumber: true,
          isValid: true,
          season: {
            select: {
              name: true,
              endDate: true
            }
          }
        },
        take: 1 
      }
    },
  });

  return user;
});