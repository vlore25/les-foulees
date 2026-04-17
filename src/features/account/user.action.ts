'use server'

import { profileFormSchema, ProfileFormState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import { saveUploadedFile } from "@/src/lib/file-storage";

export async function updateProfile(state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    const session = await getSession();
    if (!session?.userId) return { message: "Non autorisé" };

    // Conversion des données brutes
    const rawData = {
        name: formData.get('name'),
        lastname: formData.get('lastname'),
        genre: formData.get('genre'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate'),
        address: formData.get('address'),
        zipCode: formData.get('zipCode'),
        city: formData.get('city'),
        emergencyName: formData.get('emergencyName'),
        emergencyLastName: formData.get('emergencyLastName'),
        emergencyPhone: formData.get('emergencyPhone'),
        showPhoneDirectory: formData.get('showPhoneDirectory') === 'on',
        showEmailDirectory: formData.get('showEmailDirectory') === 'on',
        profileImage: formData.get('profileImage'),
    };
    console.log(rawData);

    const validated = profileFormSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const data = validated.data;
    
    let profileImageUrl = undefined;
    if (data.profileImage && data.profileImage.size > 0) {
        profileImageUrl = await saveUploadedFile(data.profileImage, "uploads/users", `${data.name}_${data.lastname}`);
    }

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                name: data.name,
                lastname: data.lastname,
                genre: data.genre,
                phone: data.phone,
                birthdate: data.birthdate,
                address: data.address, 
                zipCode: data.zipCode,
                city: data.city,
                emergencyName: data.emergencyName || null,
                emergencyLastName: data.emergencyLastName || null,
                emergencyPhone: data.emergencyPhone || null,
                showPhoneDirectory: data.showPhoneDirectory,
                showEmailDirectory: data.showEmailDirectory,
                ...(profileImageUrl ? { profileImageUrl } : {}),
            }
        });

        revalidatePath('/espace-membre/compte');
        return { 
            success: true, 
            message: "Profil mis à jour avec succès"
            
        };
        
    } catch (error) {
    console.error(error);
    return { message: "Erreur lors de la mise à jour." };
    }

    }

    /**
    * Récupère une image depuis une URL (même externe) et la renvoie en Base64
    * Utilisé pour contourner les problèmes de CORS lors de la génération de PDF
    */
    export async function fetchImageAsBase64(url: string): Promise<string | null> {
    try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return `data:${contentType};base64,${base64}`;
    } catch (error) {
    console.error("Erreur serveur lors de la récupération de l'image:", error);
    return null;
    }
    }