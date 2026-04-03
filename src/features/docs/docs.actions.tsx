"use server";

import { legalDocSchema, LegalDocFormState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveUploadedFile } from "@/src/lib/file-storage";

// --- CREATE ---
export async function createLegalDocAction(
  prevState: LegalDocFormState,
  formData: FormData
): Promise<LegalDocFormState> {
  
  const validatedFields = legalDocSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, description, file } = validatedFields.data;

  let fileUrl = "";

  if (file && file.size > 0) {
    try {
        fileUrl = await saveUploadedFile(file, "uploads/docs", title);
    } catch (e) {
      console.log(e);
        return { message: "Erreur lors de l'upload du fichier." };
    }
  } else {
      return { message: "Le fichier est requis pour la création." };
  }

  try {
    await prisma.legalDocs.create({
      data: {
        title,
        description,
        Url: fileUrl,
      },
    });
  } catch (error) {
    console.log(error);
    return { message: "Erreur base de données." };
  }

  revalidatePath("/admin/dashboard");
  return { message: "Document ajouté avec succès !" };
}

// --- UPDATE ---
export async function updateLegalDocAction(
  id: string,
  prevState: LegalDocFormState,
  formData: FormData
): Promise<LegalDocFormState> {
    
  const validatedFields = legalDocSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, description, file } = validatedFields.data;
  const dataToUpdate: any = { title, description };

  // Si nouveau fichier uploadé
  if (file && file.size > 0) {
     try {
         dataToUpdate.Url = await saveUploadedFile(file, "uploads/docs", title);
     } catch (e) {
         return { message: "Erreur lors de l'upload du fichier." };
     }
  }

  try {
    await prisma.legalDocs.update({
      where: { id },
      data: dataToUpdate,
    });
  } catch (error) {
    return { message: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/dashboard");
  return { message: "Document modifié avec succès !" };
}

// --- DELETE ---
export async function deleteLegalDocAction(id: string) {
  try {
    await prisma.legalDocs.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Erreur suppression", error);
  }
}