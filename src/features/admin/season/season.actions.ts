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

// ACTION 2 : Créer la saison avec les prix validés par l'admin
export async function generateNextSeason(customPrices: SeasonPrices) {
  try {
    // On recalcule les dates ici par sécurité (ou on pourrait les passer en args)
    const preview = await getNextSeasonPreview()
    if (!preview.success || !preview.data) throw new Error("Erreur prévision")

    const { name, startDate, endDate } = preview.data

    // Vérif doublon
    const exists = await prisma.season.findUnique({ where: { name } })
    if (exists) return { success: false, message: `La saison ${name} existe déjà !` }

    await prisma.season.create({
      data: {
        name,
        startDate,
        endDate,
        isActive: false, 
        // On utilise les prix envoyés par le formulaire
        priceStandard: customPrices.priceStandard,
        priceCouple: customPrices.priceCouple,
        priceYoung: customPrices.priceYoung,
        priceFfa: customPrices.priceFfa
      }
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: `Saison ${name} créée avec succès` }
  } catch (e) {
    console.error(e)
    return { success: false, message: "Erreur serveur lors de la création" }
  }
}