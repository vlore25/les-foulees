'use server'

import prisma from "@/lib/prisma"
import { LicenseType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/session" // Ton helper d'auth existant

export async function submitLicenseRequest(formData: FormData) {
  const session = await verifySession()
  if (!session?.userId) return { success: false, message: "Non connecté" }

  const type = formData.get("type") as LicenseType
  const licenseNumber = formData.get("licenseNumber") as string
  try {
    const activeSeason = await prisma.season.findFirst({
      where: { isActive: true }
    })

    if (!activeSeason) return { success: false, message: "Aucune saison ouverte." }

    await prisma.license.create({
      data: {
        userId: session.userId,
        seasonId: activeSeason.id,
        type: type,
        licenseNumber: licenseNumber,
        isValid: false, 
      }
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    return { success: false, message: "Erreur ou demande déjà existante." }
  }
}