'use server'

import { profileFormSchema, ProfileFormState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";

export async function updateProfile(state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    const session = await getSession();
    if (!session?.userId) return { message: "Non autorisé" };

    // Conversion des données brutes
    const rawData = {
        name: formData.get('name'),
        lastname: formData.get('lastname'),
        phone: formData.get('phone'),
        birthdate: formData.get('birthdate'),
        adress: formData.get('adress'),
        zipCode: formData.get('zipCode'),
        city: formData.get('city'),
        emergencyName: formData.get('emergencyName'),
        emergencyLastName: formData.get('emergencyLastName'),
        emergencyPhone: formData.get('emergencyPhone'),
    };

    const validated = profileFormSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    const data = validated.data;
    

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                name: data.name,
                lastname: data.lastname,
                phone: data.phone,
                birthdate: data.birthdate,
                address: data.adress, 
                zipCode: data.zipCode,
                city: data.city,
                emergencyName: data.emergencyName || null,
                emergencyLastName: data.emergencyLastName || null,
                emergencyPhone: data.emergencyPhone || null,
            }
        });

        revalidatePath('/dashboard/account');
        return { success: true, message: "Profil mis à jour avec succès" };
    } catch (error) {
        console.error(error);
        return { message: "Erreur lors de la mise à jour." };
    }
}