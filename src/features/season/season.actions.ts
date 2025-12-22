'use server'

import { prisma } from "@/src/lib/prisma"
import { addYears, getYear } from "date-fns"
import { revalidatePath } from "next/cache"




export async function generateNextSeason(formData: FormData) {
  try {

    const name = formData.get('name') as string
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)


    const priceStandard = parseFloat(formData.get('priceStandard') as string)
    const priceYoung = parseFloat(formData.get('priceYoung') as string)
    const priceFfa = parseFloat(formData.get('priceFfa') as string)

    const existingFutureSeason = await prisma.season.findFirst({
      where: {
        isActive: false, // Elle n'est pas active
        startDate: {
          gt: new Date() // Et elle commence dans le futur
        }
      }
    })

    if (existingFutureSeason) {
      return {
        success: false,
        message: `Une saison brouillon (${existingFutureSeason.name}) existe déjà. Veuillez l'activer ou la supprimer avant d'en préparer une autre.`
      }
    }

    const exists = await prisma.season.findUnique({ where: { name } })
    if (exists) return { success: false, message: `La saison ${name} existe déjà !` }

    await prisma.season.create({
      data: {
        name,
        startDate,
        endDate,
        isActive: false,
        priceStandard,
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
    ]);
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { success: false, message: "Erreur d'activation" };
  }
}

export async function deleteDraftSeason(seasonId: string) {
  try {
    await prisma.season.delete({
      where: { id: seasonId }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    return { success: false, message: "Erreur lors de la suppression" }
  }
}