'use server'

import { membershipSchema } from "@/src/lib/definitions"
import { prisma } from "@/src/lib/prisma"
import { getSession } from "@/src/lib/session"
import { revalidatePath } from "next/cache"
import { getActiveSeasonData } from "../season/dal"
import { getProfile } from "../account/dal"
import { deleteUploadedFile, saveUploadedFile } from "@/src/lib/file-storage"
import { MembershipType, PaymentMethod } from "@/prisma/generated/enums"

export type MembershipState = {
    errors?: {
        type?: string[];
        paymentMethod?: string[];
        ffaLicenseNumber?: string[];
        previousClub?: string[];
        partnerUserId?: string[];
        medicalCertificate?: string[];
    };
    message?: string;
    success?: boolean;
} | undefined;

/**
 * Helper pour vérifier si l'utilisateur est admin
 */
async function verifyAdmin() {
    const session = await getSession();
    if (!session?.userId) return false;
    const user = await getProfile(session.userId);
    return user?.role === 'ADMIN';
}


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
        partnerUserId: (formData.get("partnerUserId") as string) || undefined,
        birthdate: user.birthdate, // Ajout pour validation Zod
    }

    const medicalFile = formData.get("medicalCertificate") as File | null;
    const hasValidLicense = !!rawFormData.ffaLicenseNumber;

    // 6. Récupération de la Saison Active
    const season = await getActiveSeasonData();
    if (!season) {
        return { message: "Aucune saison active pour l'instant. Inscriptions fermées." }
    }

    if (!hasValidLicense) {
        if (!medicalFile || medicalFile.size === 0) {
            // On vérifie si une adhésion existe déjà avec un certificat (cas de la mise à jour)
            const existing = await prisma.membership.findUnique({
                where: { userId_seasonId: { userId: session.userId, seasonId: season.id } }
            });
            if (!existing?.certificateUrl) {
                return { 
                    errors: { medicalCertificate: ["Le certificat médical est obligatoire si vous n'avez pas de licence."] },
                    message: "Veuillez fournir un certificat médical." 
                };
            }
        }
        
        if (medicalFile && medicalFile.size > 0) {
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(medicalFile.type)) {
                return { 
                    errors: { medicalCertificate: ["Format de fichier invalide (PDF ou Image uniquement)."] },
                    message: "Fichier invalide." 
                };
            }
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
        partnerUserId,
    } = validatedFields.data;

    const licenseType = formData.get("licenseType") as string;
    if (licenseType === 'MUTATION' && !previousClub) {
        return {
            errors: { previousClub: ["Le nom de l'ancien club est obligatoire pour une mutation."] },
            message: "Veuillez vérifier les champs du formulaire."
        };
    }

    // Vérification spécifique pour le partenaire AVANT de commencer la transaction
    if (type === "COUPLE" && partnerUserId) {
        if (partnerUserId === session.userId) {
            return {
                errors: { partnerUserId: ["Vous ne pouvez pas vous choisir vous-même comme partenaire."] },
                message: "Sélection de partenaire invalide."
            };
        }

        const partnerExisting = await prisma.membership.findUnique({
            where: { userId_seasonId: { userId: partnerUserId, seasonId: season.id } }
        });

        if (partnerExisting && partnerExisting.status !== 'REJECTED') {
            return {
                errors: { partnerUserId: ["Ce partenaire a déjà un dossier en cours ou validé pour cette saison."] },
                message: "Partenaire indisponible."
            };
        }
    }

    let certificateUrl = null;
    if (!hasValidLicense && medicalFile && medicalFile.size > 0) {
        try {
            // Stockage : /var/www/uploads/les-foulees/docs/certificates/certif_NOM_ID
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

    try {
        await prisma.$transaction(async (tx) => {

            const existing = await tx.membership.findUnique({
                where: { userId_seasonId: { userId: session.userId, seasonId: season.id } },
                include: { payment: true, partnerOf: true }
            });

            if (existing) {
                if (existing.status === 'REJECTED' || existing.status === 'PENDING') {

                    // Si on a un certificat, on DOIT supprimer l'ancienne licence 
                    const newLicenseNumber = hasValidLicense ? ffaLicenseNumber : null;

                    // Gestion de la suppression de l'ancien certificat si on en télécharge un nouveau
                    let oldCertificateToDelete = null;
                    if (certificateUrl && existing.certificateUrl) {
                        oldCertificateToDelete = existing.certificateUrl;
                    } else if (hasValidLicense && existing.certificateUrl) {
                        // Si on passe à une licence, on supprime l'ancien certificat
                        oldCertificateToDelete = existing.certificateUrl;
                    }

                    // Si on a une licence, on peut nettoyer l'ancien certificat (null)
                    // Sinon, on garde l'ancien certificat si on n'en a pas chargé un nouveau
                    const newCertificateUrl = hasValidLicense ? null : (certificateUrl || existing.certificateUrl);

                    const isInvitedPartner = !!existing.partnerId;

                    if (isInvitedPartner) {
                        // C'est le conjoint invité qui met à jour son propre dossier (certificat/FFA)
                        // On ne touche pas au paiement commun ni au type.
                        await tx.membership.update({
                            where: { id: existing.id },
                            data: {
                                ffaLicenseNumber: newLicenseNumber,
                                previousClub: hasValidLicense ? previousClub : null,
                                status: "PENDING",
                                certificateUrl: newCertificateUrl,
                            }
                        });
                    } else {
                        // C'est l'utilisateur principal
                        await tx.membership.update({
                            where: { id: existing.id },
                            data: {
                                type,
                                ffaLicenseNumber: newLicenseNumber,
                                previousClub: hasValidLicense ? previousClub : null,
                                status: "PENDING",
                                certificateUrl: newCertificateUrl,
                            }
                        });

                        // Mise à jour Paiement
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

                        if (type === "COUPLE") {
                            if (existing.partnerOf) {
                                // Il y a déjà un partenaire lié. On le repasse en PENDING s'il était REJECTED
                                if (existing.partnerOf.status === 'REJECTED') {
                                    await tx.membership.update({
                                        where: { id: existing.partnerOf.id },
                                        data: { status: "PENDING" }
                                    });
                                }
                            } else if (partnerUserId) {
                                // Passage de INDIVIDUAL à COUPLE
                                const partnerExisting = await tx.membership.findUnique({
                                    where: { userId_seasonId: { userId: partnerUserId, seasonId: season.id } }
                                });
                                if (partnerExisting && partnerExisting.status !== 'REJECTED') {
                                    throw new Error("Votre partenaire a déjà un dossier en cours pour cette saison.");
                                }
                                if (partnerExisting && partnerExisting.status === 'REJECTED') {
                                    await tx.membership.delete({ where: { id: partnerExisting.id } });
                                }
                                await tx.membership.create({
                                    data: {
                                        userId: partnerUserId,
                                        seasonId: season.id,
                                        type: "COUPLE",
                                        status: "PENDING",
                                        partnerId: existing.id,
                                        paymentId: existing.paymentId
                                    }
                                });
                            }
                        } else {
                            // Passage de COUPLE à INDIVIDUAL : on supprime le conjoint lié
                            if (existing.partnerOf) {
                                await tx.membership.delete({
                                    where: { id: existing.partnerOf.id }
                                });
                            }
                        }
                    }

                    // Si on a un ancien certificat à supprimer, on le fait APRES la mise à jour DB réussie
                    if (oldCertificateToDelete) {
                        await deleteUploadedFile(oldCertificateToDelete);
                    }
                    // On sort de la transaction ici car le travail est fait
                    return;
                }

                // Si le dossier existe et n'est pas REJETÉ
                throw new Error("Dossier déjà existant pour cette saison");
            }

            // Création Paiement (sans membershipId car retiré de la BDD)
            const payment = await tx.payment.create({
                data: {
                    userId: session.userId,
                    amount,
                    method: paymentMethod,
                    status: "PENDING",
                }
            })

            // Création de l'adhésion principale
            const membership = await tx.membership.create({
                data: {
                    userId: session.userId,
                    seasonId: season.id,
                    type,
                    ffaLicenseNumber,
                    previousClub,
                    status: "PENDING",
                    certificateUrl: certificateUrl,
                    paymentId: payment.id
                }
            })

            // Si c'est un COUPLE, on crée l'adhésion du partenaire en lien (Strict 1-to-1)
            if (type === "COUPLE" && partnerUserId) {
                const partnerExisting = await tx.membership.findUnique({
                    where: { userId_seasonId: { userId: partnerUserId, seasonId: season.id } }
                });

                if (partnerExisting && partnerExisting.status !== 'REJECTED') {
                    throw new Error("Votre partenaire a déjà un dossier en cours pour cette saison.");
                }

                if (partnerExisting && partnerExisting.status === 'REJECTED') {
                    await tx.membership.delete({ where: { id: partnerExisting.id } });
                }

                await tx.membership.create({
                    data: {
                        userId: partnerUserId,
                        seasonId: season.id,
                        type: "COUPLE",
                        status: "PENDING",
                        partnerId: membership.id, // Relation stricte (Unique)
                        paymentId: payment.id
                    }
                });
            }
        })

        revalidatePath("/admin/adherants")
        return { success: true, message: "Demande d'adhésion enregistrée avec succès !" }

    } catch (e: any) {
        console.error(e)
        // Gestion message d'erreur doublon
        if (e.message && e.message.includes("déjà existant")) {
            return { success: false, message: e.message }
        }
        if (e.message && e.message.includes("partenaire a déjà un dossier")) {
            return { 
                success: false, 
                message: e.message,
                errors: { partnerUserId: [e.message] }
            }
        }
        return { success: false, message: "Une erreur est survenue lors de l'enregistrement." }
    }
}


export async function validateMembershipAction(membershipId: string) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        await prisma.membership.update({
            where: { id: membershipId },
            data: {
                status: "VALIDATED",
            }
        })

        revalidatePath("/espace-membre/adhesion")
        revalidatePath("/admin/adherants")
        return { success: true }
    } catch (e) {
        console.error("Erreur validation dossier:", e)
        return { success: false, message: "Erreur validation" }
    }
}


export async function refuseMembershipAction(membershipId: string) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        await prisma.membership.update({
            where: { id: membershipId },
            data: {
                status: "REJECTED",
            }
        });

        revalidatePath("/espace-membre/adhesion")
        revalidatePath("/admin/adherants")
        return { success: true, message: "Dossier refusé avec succès." };

    } catch (e) {
        console.error("Erreur refus dossier:", e);
        return { success: false, message: "Erreur technique lors du refus." };
    }
}

export async function deleteMembershipAction(membershipId: string) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        const membership = await prisma.membership.findUnique({
            where: { id: membershipId },
            include: { payment: true, partnerOf: true }
        });

        if (!membership) return { success: false, message: "Dossier introuvable." };
        if (membership.status === 'VALIDATED') {
            return { success: false, message: "Impossible de supprimer un dossier déjà validé." };
        }

        const idsToDelete = [membership.id];
        if (membership.partnerId) idsToDelete.push(membership.partnerId);
        if (membership.partnerOf) idsToDelete.push(membership.partnerOf.id);

        const membershipsToDelete = await prisma.membership.findMany({
            where: { id: { in: idsToDelete } }
        });

        await prisma.$transaction(async (tx) => {
            // Supprimer les adhésions EN PREMIER pour éviter l'erreur de clé étrangère sur le paiement
            await tx.membership.deleteMany({
                where: { id: { in: idsToDelete } }
            });

            // Supprimer le paiement lié (si présent)
            if (membership.paymentId) {
                await tx.payment.delete({
                    where: { id: membership.paymentId }
                });
            }
        });

        // Suppression des fichiers physiques après transaction réussie
        for (const m of membershipsToDelete) {
            if (m.certificateUrl) {
                await deleteUploadedFile(m.certificateUrl);
            }
        }

        revalidatePath("/admin/adherants")
        return { success: true, message: "Dossier(s) supprimé(s) avec succès." };
    } catch (e) {
        console.error("Erreur suppression dossier:", e);
        return { success: false, message: "Erreur technique lors de la suppression." };
    }
}

export async function getMembershipDetailsAction(membershipId: string) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        const membership = await prisma.membership.findUnique({
            where: { id: membershipId },
            include: {
                season: true,
                user: true,
                payment: true,
                partner: {
                    include: { user: true }
                }
            }
        });
        if (!membership) return { success: false, message: "Dossier introuvable." };

        return { success: true, data: membership };
    } catch (e) {
        return { success: false, message: "Erreur serveur" };
    }
}
