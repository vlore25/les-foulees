'use server'

import { prisma } from "@/src/lib/prisma"
import { addYears, getYear } from "date-fns"
import { revalidatePath } from "next/cache"

// TYPES
export type SeasonPrices = {
  priceStandard: number
  priceCouple: number
  priceYoung: number
  priceFfa: number
}

// ACTION 1 : Récupérer les prévisions (Dates calculées + Prix de l'an dernier)
export async function getNextSeasonPreview() {
  try {
    const lastSeason = await prisma.season.findFirst({
      orderBy: { endDate: 'desc' }
    })

    let newStart: Date, newEnd: Date, newName: string
    // Valeurs par défaut si aucune saison n'existe
    let defaultPrices: SeasonPrices = {
       priceStandard: 35.0, priceCouple: 60.0, priceYoung: 25.0, priceFfa: 98.0
    }

    if (lastSeason) {
      newStart = addYears(lastSeason.startDate, 1)
      newEnd = addYears(lastSeason.endDate, 1)
      defaultPrices = {
          priceStandard: lastSeason.priceStandard,
          priceCouple: lastSeason.priceCouple,
          priceYoung: lastSeason.priceYoung,
          priceFfa: lastSeason.priceFfa
      }
    } else {
      // Initialisation 1ère fois
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


export async function generateNextSeason(formData: FormData) {
  try {
    
    const name = formData.get('name') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)


    const priceStandard = parseFloat(formData.get('priceStandard') as string)
    const priceCouple = parseFloat(formData.get('priceCouple') as string)
    const priceYoung = parseFloat(formData.get('priceYoung') as string)
    const priceFfa = parseFloat(formData.get('priceFfa') as string)


    const exists = await prisma.season.findUnique({ where: { name } })
    if (exists) return { success: false, message: `La saison ${name} existe déjà !` }

    await prisma.season.create({
      data: {
        name,
        startDate,
        endDate,
        isActive: false, 
        priceStandard,
        priceCouple,
        priceYoung,
        priceFfa
      }
    })

    revalidatePath('/admin/seasons') 
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Erreur serveur lors de la création" }
  }
}

export async function activateSeasonAction(seasonId: string) {
  try {
    await prisma.$transaction([
      prisma.season.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      }),
      prisma.season.update({
        where: { id: seasonId },
        data: { isActive: true }
      })
    ])

    revalidatePath('/admin/dashboard')
    return { success: true }
  } catch (e) {
    return { success: false, message: "Erreur lors de l'activation" }
  }
}