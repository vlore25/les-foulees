import { prisma } from "@/src/lib/prisma"


export const getSeasonsData = async () => {
  const allSeasons = await prisma.season.findMany({
    orderBy: { startDate: 'desc' },
    include: { _count: { select: { memberships: true } } }
  });

  const now = new Date();

  const activeSeason = allSeasons.find(s => s.isActive);
  const futureSeason = allSeasons.find(s => s.startDate > now && !s.isActive);
  const archivedSeasons = allSeasons.filter(s => !s.isActive && s.startDate < now);
  const draftSeason = allSeasons.find(s => !s.isActive && s.startDate > now)

  return { activeSeason, futureSeason, archivedSeasons, draftSeason };
}

// C'est cette fonction qui doit être modifiée pour votre formulaire d'adhésion
export const getActiveSeasonData = async () => {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
      // ON RETIRE LE 'select' pour récupérer l'objet entier (avec priceStandard, etc.)
    })
    return activeSeason;
  } catch(e) {
    // On retourne null plutôt qu'une string pour éviter les conflits de types
    return null;
  }
}