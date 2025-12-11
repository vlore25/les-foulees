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

export const getActiveSeasonData = async () => {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
      select: {
        name: true,
      }
    })
    return activeSeason;
  }catch(e){
    return("Pas de season active");
  }
}