'use server'

import { EventType } from "@/prisma/generated/enums";
import { eventSchema, eventUpdateSchema } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
import { verifySession } from "@/src/lib/session";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";

export type EventFormState = {
    error?: {
        title?: string[];
        dateStart?: string[];
        dateEnd?: string[];
        place?: string[];
        eventtype?: string[];
        description?: string[];
        distance?: string[]
        picture?: string[];
        distances?: string[]; // NOUVEAU : Pour gérer les erreurs liées aux distances
    };
    message?: string | null;
} | undefined;


//========CREATE EVENT=========
export async function createEvent(state: EventFormState, formData: FormData): Promise<EventFormState> {

    const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    // NOUVEAU : on récupère les distances (selon la façon dont vous les envoyez depuis le formulaire, 
    // assurez-vous que votre eventSchema de zod gère "distances" comme un array de strings)
    const { title, dateStart, dateEnd, place, eventtype, description, picture, distances } = validatedFields.data;

    const bytes = await picture.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${title.replace(/\s/g, '-')}`;
    const path = join(process.cwd(), 'public/uploads', filename);

    writeFile(path, buffer);
    const imageUrlPath = `/uploads/${filename}`;
    const eventTypeRaw = eventtype;

    if (!Object.values(EventType).includes(eventTypeRaw as EventType)) {
        throw new Error("Event invalide");
    }

    try {
         await prisma.event.create({
            data: {
                title: title,
                dateStart: dateStart,
                dateEnd: dateEnd,
                location: place,
                type: eventTypeRaw,
                description: description,
                distance: distances,
                imgUrl: imageUrlPath,
                distances: distances || [], // NOUVEAU : enregistrement des distances disponibles
            },
        })

    }
    catch (e) {
        console.error("Erreur :", e);
        return { message: 'Une erreur s\'est produite, veuillez réessayer.' };
    }

    return { message: 'Événement créé avec succès!' };
}

//========UPDATE EVENT=========
export async function updateEventAction(
  eventId: string,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  
  const validatedFields = eventUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  // NOUVEAU : On récupère également les distances
  const { title, dateStart, dateEnd, place, eventtype, description, picture, distances } = validatedFields.data;
  const eventTypeRaw = eventtype;

  if (!Object.values(EventType).includes(eventTypeRaw as EventType)) {
      return { message: "Type d'événement invalide" };
  }

  let dataToUpdate: any = {
    title,
    dateStart,
    dateEnd,
    location: place,
    type: eventTypeRaw,
    description,
    distances: distances || [], // NOUVEAU : mise à jour des distances
  };

  if (picture && picture.size > 0) {
    const bytes = await picture.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${title.replace(/\s/g, '-')}`;
    const path = join(process.cwd(), 'public/uploads', filename);
    
    await writeFile(path, buffer);
    dataToUpdate.imgUrl = `/uploads/${filename}`;
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: dataToUpdate,
    });
  } catch (e) {
    console.error("Erreur update :", e);
    return { message: 'Erreur lors de la modification.' };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  
  return { message: 'Événement modifié avec succès !' };
}

//========DELETE EVENT=========
export async function deleteEventAction(eventId: string) {
  await prisma.event.delete({
    where: { id: eventId },
  });

  revalidatePath("/events");
}

//========JOIN EVENT=========
// NOUVEAU : L'action prend maintenant la distance choisie en paramètre optionnel
export async function joinEventAction(eventId: string, selectedDistance?: string) {
  
  const session = await verifySession();

  if (!session || !session.userId) {
     return { 
       success: false, 
       message: "Vous devez être connecté pour rejoindre un événement." 
     };
  }

  try {
    // NOUVEAU : Création dans la table de liaison explicite EventRegistration
    await prisma.eventRegistration.create({
      data: {
        userId: session.userId,
        eventId: eventId,
        distance: selectedDistance || null // Enregistre la distance si elle est fournie
      }
    });

    revalidatePath('/espace-membre/evenements')
    revalidatePath(`/espace-membre/evenement/${eventId}`) 
    
    return { success: true, message: "Inscription validée !" }

  } catch (error) {
    console.error("Erreur inscription event:", error)
    // Utile pour gérer le cas où l'utilisateur essaie de s'inscrire 2 fois (violation de la contrainte @@unique)
    return { success: false, message: "Vous êtes déjà inscrit ou une erreur est survenue." }
  }
}

//========LEAVE EVENT=========
export async function leaveEventAction(eventId: string) {
  const session = await verifySession()
  if (!session?.userId) return { success: false, message: "Non autorisé" }

  try {
    // NOUVEAU : Suppression de l'entrée dans la table de liaison EventRegistration
    await prisma.eventRegistration.delete({
      where: {
        userId_eventId: {
          userId: session.userId,
          eventId: eventId
        }
      }
    });

    revalidatePath('/espace-membre/evenements')
    revalidatePath(`/espace-membre/evenement/${eventId}`)
    return { success: true, message: "Désinscription prise en compte." }
  } catch (error) {
    return { success: false, message: "Erreur lors de la désinscription." }
  }
}