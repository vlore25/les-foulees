import { prisma } from "@/src/lib/prisma"
import { addYears, getYear } from "date-fns";


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

export type SeasonPrices = {
  priceStandard: number
  priceYoung: number
  priceFfa: number
}

export type SeasonPreviewData = {
  name: string;
  startDate: Date;
  endDate: Date;
  prices: SeasonPrices;
}

export type NextSeasonResponse = {
  success: boolean;
  data?: SeasonPreviewData;
  message?: string;
}

export async function getNextSeasonPreview(): Promise<NextSeasonResponse> {
  try {
    const lastSeason = await prisma.season.findFirst({
      orderBy: { endDate: 'desc' }
    })

    let newStart: Date, newEnd: Date, newName: string
    let defaultPrices: SeasonPrices = {
      priceStandard: 35.0, priceYoung: 25.0, priceFfa: 98.0
    }

    if (lastSeason) {
      newStart = addYears(lastSeason.startDate, 1)
      newEnd = addYears(lastSeason.endDate, 1)
      defaultPrices = {
        priceStandard: lastSeason.priceStandard,
        priceYoung: lastSeason.priceYoung,
        priceFfa: lastSeason.priceFfa
      }
    } else {
      const now = new Date()
      const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1
      newStart = new Date(year, 8, 1)
      newEnd = new Date(year + 1, 7, 31)
    }

    newName = `${getYear(newStart)}-${getYear(newEnd)}`

    return {
      success: true,
      data: { name: newName, startDate: newStart, endDate: newEnd, prices: defaultPrices }
    }
  } catch (e) {
    return { success: false, message: "Impossible de calculer la prévision" }
  }
}

export const getActiveSeasonData = async () => {
  try {
    const activeSeason = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
    })
    return activeSeason;
  } catch(e) {
    return null;
  }
}