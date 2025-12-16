'use server'

import { MembershipType, PaymentMethod } from "@/app/generated/prisma/enums"
import { membershipSchema } from "@/src/lib/definitions"
import { prisma } from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { revalidatePath } from "next/cache"
import { getActiveSeasonData } from "../admin/season/dal"
import { generateSignedMembershipPdf } from "./service/pdf-service"
import { getProfile } from "../account/dal"
import { saveUploadedFile } from "@/src/lib/file-storage"

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
    const user = await getProfile(session.userId);
    if (!user) return { message: "Utilisateur introuvable." };

    const rawFormData = {
        type: formData.get("type") as MembershipType,
        paymentMethod: (formData.get("paymentMethod") as string)?.toUpperCase() as PaymentMethod,
        showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
        showEmailDirectory: formData.get('showEmailDirectory') === 'on',
        ffaLicenseNumber: (formData.get("ffa") as string) || undefined,
        previousClub: (formData.get("club") as string) || undefined,
        signature: formData.get("signature") as string,
    }


    const medicalFile = formData.get("medicalCertificate") as File | null;

    const hasValidLicense = !!rawFormData.ffaLicenseNumber;

    if (!hasValidLicense) {
        if (!medicalFile || medicalFile.size === 0) {
            return { message: "Le certificat médical est obligatoire si vous n'avez pas de licence." };
        }
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(medicalFile.type)) {
            return { message: "Format de fichier invalide (PDF ou Image uniquement)." };
        }
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

    let certificateUrl = null;

    if (!hasValidLicense && medicalFile && medicalFile.size > 0) {
        try {
            // On utilise notre service propre
            // On stocke dans : public/uploads/docs/certificates
            // Avec un préfixe : certif_NOM_ID
            certificateUrl = await saveUploadedFile(
                medicalFile,
                "uploads/docs/certificates",
                `certif_${user.lastname}_${session.userId}`
            );

        } catch (e) {
            console.error("Erreur upload certif", e);
            return { message: "Erreur technique lors de la sauvegarde du certificat." };
        }
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
                    adhesionPdf: pdfPath,
                    certificateUrl: certificateUrl,          
                    medicalCertificateVerified: hasValidLicense
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

        revalidatePath('/admin/dashboard?tab=membership')
        revalidatePath('/dashboard/adhesion')
        return { success: true }
    } catch (e) {
        return { success: false, message: "Erreur validation" }
    }
}