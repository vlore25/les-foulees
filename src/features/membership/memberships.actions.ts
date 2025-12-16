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

    // 1. Vérification Session & Utilisateur
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

    // 3. Validation Fichier Médical
    if (!hasValidLicense) {
        if (!medicalFile || medicalFile.size === 0) {
            return { message: "Le certificat médical est obligatoire si vous n'avez pas de licence." };
        }
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(medicalFile.type)) {
            return { message: "Format de fichier invalide (PDF ou Image uniquement)." };
        }
    }

    // 4. Validation Zod (Types et Contraintes)
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

    // 5. Validation Conditionnelle (Mutation)
    const licenseType = formData.get("licenseType") as string;
    if (licenseType === 'MUTATION' && !previousClub) {
        return {
            errors: { previousClub: ["Le nom de l'ancien club est obligatoire pour une mutation."] },
            message: "Veuillez vérifier les champs du formulaire."
        };
    }

    // 6. Récupération de la Saison Active
    const season = await getActiveSeasonData();
    if (!season) {
        return { message: "Aucune saison active pour l'instant. Inscriptions fermées." }
    }

    // 7. Upload du Certificat (si nécessaire)
    let certificateUrl = null;
    if (!hasValidLicense && medicalFile && medicalFile.size > 0) {
        try {
            // Stockage : public/uploads/docs/certificates/certif_NOM_ID
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

    // 8. Calcul du Montant
    let amount = 0;
    switch (type) {
        case "INDIVIDUAL": amount = season.priceStandard; break;
        case "COUPLE": amount = season.priceCouple; break;
        case "YOUNG": amount = season.priceYoung; break;
        case "LICENSE_RUNNING": amount = season.priceFfa; break;
        default: amount = season.priceStandard;
    }

    // 9. Génération du PDF
    let pdfPath = null;
    try {
        pdfPath = await generateSignedMembershipPdf({
            user: user,
            seasonName: season.name,
            signatureBase64: rawFormData.signature,
            userProfile: user,
            formData: {
                ...validatedFields.data,
                licenseType: licenseType,
                ffa: ffaLicenseNumber,
                club: previousClub,
                paymentMethod: paymentMethod
            }
        });
    } catch (e) {
        console.error("Erreur PDF:", e);
        return { message: "Erreur lors de la création du document PDF." };
    }

    // 10. Enregistrement en Base de Données (Transaction)
    try {
        await prisma.$transaction(async (tx) => {
            
            // A. Vérification de l'existence
            const existing = await tx.membership.findUnique({
                where: { userId_seasonId: { userId: session.userId, seasonId: season.id } },
                include: { payment: true }
            });

            // B. Logique : Création ou Mise à jour (si rejeté)
            if (existing) {
                // Si le dossier a été REJETÉ, on le met à jour pour permettre une nouvelle tentative
                if (existing.status === 'REJECTED') {
    
    // On détermine si on doit nettoyer les champs opposés
    // Si on a un certificat, on DOIT supprimer l'ancienne licence (null)
    const newLicenseNumber = hasValidLicense ? ffaLicenseNumber : null; 
    
    // Si on a une licence, on peut nettoyer l'ancien certificat (null)
    // Note : certificateUrl est null ici si on n'a pas uploadé de fichier, 
    // mais si on passe en mode licence, on veut forcer le nettoyage.
    const newCertificateUrl = hasValidLicense ? null : certificateUrl;

    await tx.membership.update({
        where: { id: existing.id },
        data: {
            type,
            // --- CORRECTION ICI ---
            // On force 'null' si ce n'est pas une licence, pour effacer l'ancienne valeur
            ffaLicenseNumber: newLicenseNumber, 
            
            previousClub,
            sharePhone: showPhoneDirectory,
            shareEmail: showEmailDirectory,
            status: "PENDING", 
            adhesionPdf: pdfPath,
            
            // --- ET ICI ---
            // On utilise la nouvelle URL ou on nettoie si on est passé en mode licence
            certificateUrl: newCertificateUrl, 
            
            medicalCertificateVerified: hasValidLicense // false si c'est un certificat
        }
    });

                    // Mise à jour Paiement (on force le statut PENDING pour re-vérification)
                    if (existing.payment) {
                        await tx.payment.update({
                            where: { id: existing.payment.id },
                            data: {
                                amount,
                                method: paymentMethod,
                                status: "PENDING"
                            }
                        });
                    }
                    // On sort de la transaction ici car le travail est fait
                    return; 
                } 
                
                // Si le dossier existe et n'est pas REJETÉ (donc PENDING ou VALIDATED)
                throw new Error("Dossier déjà existant pour cette saison");
            }

            // C. Si aucun dossier n'existe : Création normale
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

            // Création Paiement associé
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

        // Rafraichissement des caches
        revalidatePath('/dashboard?tab=membership')
        return { success: true, message: "Demande d'adhésion enregistrée avec succès !" }

    } catch (e: any) {
        console.error(e)
        // Gestion message d'erreur doublon
        if (e.message && e.message.includes("déjà existant")) {
            return { success: false, message: e.message }
        }
        return { success: false, message: "Une erreur est survenue lors de l'enregistrement." }
    }
}


// --- ACTION ADMIN ---

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


export async function refuseMembershipAction(membershipId: string) {
    try {
        await prisma.membership.update({
            where: { id: membershipId },
            data: {
                status: "REJECTED",
                medicalCertificateVerified: false 
            }
        });

        revalidatePath('/admin/dashboard?tab=membership');
        revalidatePath('/dashboard/adhesion'); 
        
        return { success: true, message: "Dossier refusé avec succès." };

    } catch (e) {
        console.error("Erreur refus dossier:", e);
        return { success: false, message: "Erreur technique lors du refus." };
    }
}