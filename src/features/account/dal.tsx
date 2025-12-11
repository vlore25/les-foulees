import 'server-only';
import { prisma } from '@/src/lib/prisma';
import { cache } from 'react';

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
      memberships: {
        where: {
          season: {
            isActive: true 
          }
        },
        select: {
          id: true,
          type: true,       
          ffaLicenseNumber: true, 
          status: true,          
          medicalCertificateVerified: true,
          season: {
            select: {
              name: true,
              endDate: true
            }
          }
        },
        take: 1 // On prend la seule adhésion active
      }
    },
  });

  return user;
});