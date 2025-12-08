"use server";

import { legalDocSchema, LegalDocFormState } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `doc-${Date.now()}-${title.replace(/\s/g, "-")}`;
    const path = join(process.cwd(), "public/uploads/docs", filename);
    
    try {
        await writeFile(path, buffer);
        fileUrl = `/uploads/docs/${filename}`;
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
     const bytes = await file.arrayBuffer();
     const buffer = Buffer.from(bytes);
     const filename = `doc-${Date.now()}-${file.name.replace(/\s/g, "-")}`;
     const path = join(process.cwd(), "public/uploads/docs", filename);

     try {
         await writeFile(path, buffer);
         dataToUpdate.Url = `/uploads/docs/${filename}`;
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