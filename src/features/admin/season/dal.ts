import { prisma } from "@/src/lib/prisma"


export const getSeasons = async () => {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: {
        startDate: 'desc'
      },
      include: {
        _count: {
          select: { memberships: true }
        }
      }
    })
    return seasons
  } catch (error) {
    console.error("Erreur lors de la récupération des saisons:", error)
    return []
  }
}