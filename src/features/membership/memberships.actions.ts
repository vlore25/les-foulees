'use server'

import { MembershipType, PaymentMethod } from "@/app/generated/prisma/enums"
import { membershipSchema } from "@/src/lib/definitions"
import { prisma } from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { revalidatePath } from "next/cache"
import { getActiveSeasonData } from "../admin/season/dal"
import { generateSignedMembershipPdf } from "./service/pdf-service"
import { getProfile } from "../account/dal"

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

    // 1. Vérification Session & Utilisateur
    const session = await getSession();
    if (!session?.userId) return { message: "Vous devez être connecté pour faire cette demande." };
    const user = await getProfile(session.userId);
    if (!user) return { message: "Utilisateur introuvable." };

    // 2. Extraction et nettoyage des données
    const rawFormData = {
        type: formData.get("type") as MembershipType,
        // On s'assure que la méthode est en MAJUSCULE pour matcher l'Enum Prisma
        paymentMethod: (formData.get("paymentMethod") as string)?.toUpperCase() as PaymentMethod,
        showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
        showEmailDirectory: formData.get('showEmailDirectory') === 'on',
        // Conversion des chaînes vides ou nulles en undefined pour Zod
        ffaLicenseNumber: (formData.get("ffa") as string) || undefined,
        previousClub: (formData.get("club") as string) || undefined,
        signature: formData.get("signature") as string,
    }

    // 3. Validation Zod (Schéma de base)
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

    // 4. Validation Conditionnelle : Mutation oblige d'avoir un ancien club
    // Cette info n'est pas dans le schéma Zod principal, on la récupère manuellement
    const licenseType = formData.get("licenseType") as string;
    
    if (licenseType === 'MUTATION' && !previousClub) {
        return {
             errors: { previousClub: ["Le nom de l'ancien club est obligatoire pour une mutation."] },
             message: "Veuillez vérifier les champs du formulaire."
        };
    }

    // 5. Récupération de la saison active
    const season = await getActiveSeasonData();
    if (!season) {
        return { message: "Aucune saison active pour l'instant. Inscriptions fermées." }
    }

    // 6. Calcul du montant
    let amount = 0;
    switch (type) {
        case "INDIVIDUAL": amount = season.priceStandard; break;
        case "COUPLE": amount = season.priceCouple; break;
        case "YOUNG": amount = season.priceYoung; break;
        case "LICENSE_RUNNING": amount = season.priceFfa; break;
        default: amount = season.priceStandard;
    }

    // 7. Génération du PDF
    let pdfPath = null;
    try {
        pdfPath = await generateSignedMembershipPdf({
            user: user,                // Utilisé pour le nom du fichier
            seasonName: season.name,
            signatureBase64: rawFormData.signature,
            userProfile: user,         // Utilisé pour remplir le contenu du PDF
            formData: {
                ...validatedFields.data,
                // On passe le type de licence (RENEWAL/MUTATION)
                licenseType: licenseType, 
                // Mapping des champs pour correspondre aux attentes du pdf-service
                ffa: ffaLicenseNumber, 
                club: previousClub,
                // On passe la méthode de paiement (ex: "CHECK" ou "TRANSFER")
                paymentMethod: paymentMethod 
            }
        });
    } catch (e) {
        console.error("Erreur PDF:", e);
        return { message: "Erreur lors de la création du document PDF." };
    }

    // 8. Enregistrement en Base de Données (Transaction)
    try {
        await prisma.$transaction(async (tx) => {
            // Vérification doublon
            const existing = await tx.membership.findUnique({
                where: { userId_seasonId: { userId: session.userId, seasonId: season.id } }
            });
            if (existing) throw new Error("Dossier déjà existant pour cette saison");

            // Création Membership
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
                    adhesionPdf: pdfPath
                }
            })

            // Création Paiement
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
        // Gestion message d'erreur doublon
        if (e.message.includes("déjà existant")) {
            return { success: false, message: e.message }
        }
        return { success: false, message: "Une erreur est survenue lors de l'enregistrement." }
    }
}

// --- ACTION ADMIN (inchangée) ---
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