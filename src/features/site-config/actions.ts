"use server"

import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { getProfile } from "@/src/features/account/dal";
import { revalidatePath } from "next/cache";
import { saveUploadedFile } from "@/src/lib/file-storage";

async function verifyAdmin() {
    const session = await getSession();
    if (!session?.isAuth) return false;
    const profile = await getProfile(session.userId as string);
    return profile?.role === 'ADMIN';
}

export async function uploadHeroImagesAction(formData: FormData) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        const desktopFile = formData.get("heroDesktop") as File | null;
        const mobileFile = formData.get("heroMobile") as File | null;

        const dataToUpdate: any = {};

        if (desktopFile && desktopFile.size > 0) {
            dataToUpdate.heroDesktopUrl = await saveUploadedFile(desktopFile, "uploads/site", "hero_desktop");
        }
        if (mobileFile && mobileFile.size > 0) {
            dataToUpdate.heroMobileUrl = await saveUploadedFile(mobileFile, "uploads/site", "hero_mobile");
        }

        if (Object.keys(dataToUpdate).length > 0) {
            await prisma.siteConfig.upsert({
                where: { id: "default" },
                update: dataToUpdate,
                create: { id: "default", ...dataToUpdate }
            });
            revalidatePath("/");
        }

        return { success: true, message: "Images mises à jour avec succès." };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Erreur lors de l'upload des images." };
    }
}

export async function updateSiteConfigAction(data: { privacyPolicy?: string | null, legalNotice?: string | null }) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        await prisma.siteConfig.upsert({
            where: { id: "default" },
            update: data,
            create: { id: "default", ...data }
        });
        
        revalidatePath("/");
        revalidatePath("/politique-de-confidentialite");
        revalidatePath("/mentions-legales");
        return { success: true, message: "Configuration mise à jour avec succès." };
    } catch (e) {
        console.error("Erreur updateSiteConfigAction:", e);
        return { success: false, message: "Erreur technique lors de la mise à jour." };
    }
}

export async function upsertTrainingScheduleAction(formData: FormData) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        const id = formData.get("id") as string | null;
        const day = formData.get("day") as string;
        const hour = formData.get("hour") as string;
        const place = formData.get("place") as string;
        const imgFile = formData.get("imgFile") as File | null;
        const order = parseInt(formData.get("order") as string || "0");

        let imgUrl = formData.get("imgUrl") as string | null;

        if (imgFile && imgFile.size > 0) {
            imgUrl = await saveUploadedFile(imgFile, "uploads/site/training", `training_${Date.now()}`);
        }

        if (id && id !== "null") {
            await prisma.trainingSchedule.update({
                where: { id },
                data: {
                    day,
                    hour,
                    place,
                    order,
                    ...(imgUrl ? { imgUrl } : {})
                }
            });
        } else {
            await prisma.trainingSchedule.create({
                data: {
                    day,
                    hour,
                    place,
                    imgUrl,
                    order
                }
            });
        }
        revalidatePath("/");
        return { success: true, message: "Horaire enregistré avec succès." };
    } catch (e) {
        console.error("Erreur upsertTrainingScheduleAction:", e);
        return { success: false, message: "Erreur technique lors de l'enregistrement." };
    }
}

export async function deleteTrainingScheduleAction(id: string) {
    if (!await verifyAdmin()) return { success: false, message: "Action non autorisée." };

    try {
        await prisma.trainingSchedule.delete({
            where: { id }
        });
        revalidatePath("/");
        return { success: true, message: "Horaire supprimé." };
    } catch (e) {
        console.error("Erreur deleteTrainingScheduleAction:", e);
        return { success: false, message: "Erreur technique lors de la suppression." };
    }
}
