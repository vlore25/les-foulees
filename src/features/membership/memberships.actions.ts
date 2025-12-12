'use server'

import { MembershipType, PaymentMethod } from "@/app/generated/prisma/enums"
import { membershipSchema } from "@/src/lib/definitions"
import { prisma } from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { get } from "http"
import { revalidatePath } from "next/cache"
import { getActiveSeasonData } from "../admin/season/dal"

// --- 1. ACTION UTILISATEUR : CRÉER SA DEMANDE D'ADHÉSION ---
export async function createMembershipRequest(formData: FormData) {
    // 1. Récupérer l'utilisateur connecté
    const session = await getSession();
    if (!session?.userId) return { message: "Non autorisé" };

    const rawFormData = {
        type: formData.get("type") as MembershipType,
        paymentMethod: formData.get("paymentMethod") as PaymentMethod,
        showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
        showEmailDirectory: formData.get('showEmailDirectory') === 'on',
        ffaLicenseNumber: formData.get("ffa") as string,
        previousClub: formData.get("club") as string,
    }

    const validatedFields = membershipSchema.safeParse(rawFormData);

    const season = await getActiveSeasonData();
    if (!season) {
        return { message: "Aucune saison active pour l'instant." }
    }

    // 3. Calculer le montant
    let amount = 0
    switch (type) {
        case "INDIVIDUAL": amount = season.priceStandard; break;
        case "COUPLE": amount = season.priceCouple; break;
        case "YOUNG": amount = season.priceYoung; break;
        case "LICENSE_RUNNING": amount = season.priceFfa; break;
    }

    try {
        // 4. Création Transactionnelle (Adhésion + Paiement)
        await prisma.$transaction(async (tx) => {

            // Créer l'adhésion (Status PENDING par défaut)
            const membership = await tx.membership.create({
                data: {
                    userId: session.user.id,
                    seasonId,
                    type,
                    ffaLicenseNumber,
                    previousClub,
                    sharePhone,
                    shareEmail,
                    imageRights,
                    status: "PENDING", // En attente de validation admin
                }
            })

            // Créer le paiement (Status PENDING par défaut)
            await tx.payment.create({
                data: {
                    userId: session.user.id,
                    membershipId: membership.id,
                    amount,
                    method: paymentMethod,
                    status: "PENDING"
                }
            })
        })

        revalidatePath('/dashboard')
        return { success: true }

    } catch (e) {
        console.error(e)
        return { success: false, message: "Erreur lors de l'inscription" }
    }
}

// --- 2. ACTION ADMIN : VALIDER LE PAIEMENT ET L'ADHÉSION ---
export async function validateMembershipAction(membershipId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Passer l'adhésion en VALIDATED
            const membership = await tx.membership.update({
                where: { id: membershipId },
                data: {
                    status: "VALIDATED",
                    medicalCertificateVerified: true // On suppose que l'admin a vérifié le papier
                }
            })

            // 2. Passer le paiement en PAID
            // On cherche le paiement lié à cette adhésion
            await tx.payment.update({
                where: { membershipId: membershipId },
                data: { status: "PAID" }
            })
        })

        revalidatePath('/admin/dashboard')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur validation" }
    }
}