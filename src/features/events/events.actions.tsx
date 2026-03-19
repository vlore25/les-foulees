'use server'

import { EventType } from "@/prisma/generated/enums";
import { eventSchema, eventUpdateSchema } from "@/src/lib/definitions";
import { saveUploadedFile } from "@/src/lib/file-storage";
import { prisma } from "@/src/lib/prisma";
import { verifySession } from "@/src/lib/session";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import { getEventParticipantsForExport } from "./dal";
import { getCurrentUser } from "../users/dal";

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

  const rawDistances = formData.getAll('distances') as string[];

  // Fusionnez les distances manuellement avant le safeParse
  const dataForValidation = {
    ...Object.fromEntries(formData.entries()),
    distances: rawDistances
  };

  const validatedFields = eventSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }


  const { title, dateStart, dateEnd, place, eventtype, description, picture, distances } = validatedFields.data;

  const eventTypeRaw = eventtype;

  if (!Object.values(EventType).includes(eventTypeRaw as EventType)) {
    throw new Error("Event invalide");
  }

  try {
    const imageUrlPath = await saveUploadedFile(
      picture,
      "uploads/events",
      title
    );
    await prisma.event.create({
      data: {
        title: title,
        dateStart: dateStart,
        dateEnd: dateEnd,
        location: place,
        type: eventTypeRaw,
        description: description,
        distances: distances || [],
        imgUrl: imageUrlPath,
      },
    })

  }
  catch (e) {
    console.error("Erreur :", e);
    return { message: 'Une erreur s\'est produite, veuillez réessayer.' };
  }
  revalidatePath("/admin/evenements"); //
  revalidatePath("/evenements");
  return { message: 'Événement créé avec succès!' };
}

//========UPDATE EVENT=========
export async function updateEventAction(
  eventId: string,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const session = await verifySession(); //
  if (!session) return { message: "Non autorisé" };

  const rawDistances = formData.getAll('distances') as string[];

  const dataForValidation = {
    ...Object.fromEntries(formData.entries()),
    distances: rawDistances
  };

  // 2. Validation
  const validatedFields = eventUpdateSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, dateStart, dateEnd, place, eventtype, description, picture, distances } = validatedFields.data;
  const eventTypeRaw = eventtype;

  if (!Object.values(EventType).includes(eventTypeRaw as EventType)) {
    return { message: "Type d'événement invalide" };
  }

  try {
    let dataToUpdate: any = {
      title,
      dateStart,
      dateEnd,
      location: place,
      type: eventtype as EventType,
      description,
      distances: distances || [], //
    };

    if (picture instanceof File && picture.size > 0) {
      const imageUrlPath = await saveUploadedFile(
        picture,
        "uploads/events",
        title || "event"
      );
      dataToUpdate.imgUrl = imageUrlPath; // On ajoute l'URL au reste des données
    }

    // 7. Mise à jour en base de données
    await prisma.event.update({
      where: { id: eventId },
      data: dataToUpdate,
    }); //

    // 8. Revalidation du cache
    revalidatePath("/events"); //
    revalidatePath(`/events/${eventId}`); //
    revalidatePath("/admin/evenements");

    return { message: 'Événement modifié avec succès !' };

  } catch (e) {
    console.error("Erreur update :", e);
    return { message: 'Erreur lors de la modification.' };
  }
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



export async function exportEventParticipantsAction(eventId: string, targetDistance?: string) {
    const user = await getCurrentUser();   

    if (user?.role !== "ADMIN") {
        return { success: false, message: "Seul un administrateur peut exporter ces données." };
    }


    const event = await getEventParticipantsForExport(eventId);

    if (!event) {
        return { success: false, message: "Événement introuvable" };
    }

    // NOUVEAU : Filtrage par distance
    let registrationsToExport = event.registrations;
    if (targetDistance) {
        registrationsToExport = event.registrations.filter(
            reg => (reg.distance || "Général") === targetDistance
        );
    }

    if (registrationsToExport.length === 0) {
        return { success: false, message: "Aucun participant pour cette distance." };
    }

    const csvHeader = "Nom;Prénom;Email;Téléphone;Distance\n";
    
    const csvRows = registrationsToExport.map(reg => {
        const lastname = reg.user.lastname.replace(/;/g, ' ');
        const name = reg.user.name.replace(/;/g, ' ');
        const email = reg.user.email.replace(/;/g, ' ');
        const phone = reg.user.phone?.replace(/;/g, ' ') || "";
        const distance = reg.distance || "Général";
        
        return `${lastname};${name};${email};${phone};${distance}`;
    }).join("\n");

    return { 
        success: true, 
        csv: csvHeader + csvRows, 
        title: event.title 
    };
}

export async function fetchEventParticipantsAction(eventId: string) {
    const user = await getCurrentUser()
    
    if (user?.role !== 'ADMIN') {
        return { success: false, data: [] }; 
    }

    const event = await getEventParticipantsForExport(eventId);

    return { success: true, data: event?.registrations || [] };
}