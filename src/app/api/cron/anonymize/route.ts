import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';

export async function GET(request: Request) {
  // Vercel sécurise les crons en envoyant l'en-tête Authorization
  // avec le token défini dans vos variables d'environnement Vercel (CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Calculer la date d'il y a 3 ans
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

  try {
    const usersToAnonymize = await prisma.user.findMany({
      where: {
        status: 'INACTIVE',
        deactivatedAt: {
          lte: threeYearsAgo
        }
      }
    });

    let anonymizedCount = 0;

    for (const user of usersToAnonymize) {
      // S'assurer qu'il n'est pas déjà anonymisé
      if (user.name === "Ancien" && user.lastname === "Utilisateur") {
          continue;
      }

      if (user.profileImageUrl) {
          const { deleteUploadedFile } = await import('@/src/lib/file-storage');
          await deleteUploadedFile(user.profileImageUrl);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
            name: "Ancien",
            lastname: "Utilisateur",
            email: `anonyme_${user.id.substring(0, 8)}@les-foulees.fr`,
            phone: null,
            address: "Effacée",
            zipCode: "00000",
            city: "Effacée",
            birthdate: null,
            emergencyName: null,
            emergencyLastName: null,
            emergencyPhone: null,
            profileImageUrl: null,
            password: "",
            showEmailDirectory: false,
            showPhoneDirectory: false
        }
      });
      anonymizedCount++;
    }

    return NextResponse.json({ success: true, count: anonymizedCount });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
