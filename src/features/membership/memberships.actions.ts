'use server'

import { MembershipType, PaymentMethod } from "@/app/generated/prisma/enums"
import { membershipSchema } from "@/src/lib/definitions"
import { prisma } from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { revalidatePath } from "next/cache"
import { getActiveSeasonData } from "../admin/season/dal"

// Type pour le retour de l'action
export type MembershipState = {
    errors?: {
        type?: string[];
        paymentMethod?: string[];
        ffaLicenseNumber?: string[];
        previousClub?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;


export async function createMembershipRequest(prevState: any, formData: FormData): Promise<MembershipState> {

    const session = await getSession();
    if (!session?.userId) return { message: "Vous devez être connecté pour faire cette demande." };

    const rawFormData = {
        type: formData.get("type") as MembershipType,
        paymentMethod: formData.get("paymentMethod") as PaymentMethod,
        showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
        showEmailDirectory: formData.get('showEmailDirectory') === 'on',
        ffaLicenseNumber: formData.get("ffa") as string,
        previousClub: formData.get("club") as string,
    }

    const validatedFields = membershipSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Veuillez vérifier les champs du formulaire."
        }
    }

    const { 
        type, 
        paymentMethod, 
        ffaLicenseNumber, 
        previousClub, 
        showPhoneDirectory, 
        showEmailDirectory 
    } = validatedFields.data;

    const season = await getActiveSeasonData();
    if (!season) {
        return { message: "Aucune saison active pour l'instant. Inscriptions fermées." }
    }

    let amount = 0;
    switch (type) {
        case "INDIVIDUAL": amount = season.priceStandard; break;
        case "COUPLE": amount = season.priceCouple; break;
        case "YOUNG": amount = season.priceYoung; break;
        case "LICENSE_RUNNING": amount = season.priceFfa; break;
        default: amount = season.priceStandard;
    }

   try {

        await prisma.$transaction(async (tx) => {

            const existing = await tx.membership.findUnique({
                where: { userId_seasonId: { userId: session.userId, seasonId: season.id } }
            });
            if (existing) throw new Error("Dossier déjà existant pour cette saison");

            const membership = await tx.membership.create({
                data: {
                    userId: session.userId,
                    seasonId: season.id, 
                    type,
                    ffaLicenseNumber,
                    previousClub,
                    sharePhone: showPhoneDirectory,
                    shareEmail: showEmailDirectory,
                    status: "PENDING",
                }
            })

            // Créer le paiement
            await tx.payment.create({
                data: {
                    userId: session.userId,
                    membershipId: membership.id,
                    amount,
                    method: paymentMethod,
                    status: "PENDING"
                }
            })
        })

        revalidatePath('/dashboard')
        return { success: true, message: "Demande d'adhésion enregistrée avec succès !" }

    } catch (e: any) {
        console.error(e)
        // Gestion simple de l'erreur "déjà existant"
        if (e.message.includes("déjà une demande")) {
            return { success: false, message: e.message }
        }
        return { success: false, message: "Une erreur est survenue lors de l'enregistrement." }
    }
}

// --- 2. ACTION ADMIN (inchangée mais incluse pour référence) ---
export async function validateMembershipAction(membershipId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.membership.update({
                where: { id: membershipId },
                data: {
                    status: "VALIDATED",
                    medicalCertificateVerified: true
                }
            })

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