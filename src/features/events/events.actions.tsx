'use server'

import { EventType } from "@/prisma/generated/enums";
import { eventSchema, eventUpdateSchema } from "@/src/lib/definitions";
import { saveUploadedFile } from "@/src/lib/file-storage";
import { prisma } from "@/src/lib/prisma";
import { verifySession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
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
    participations?: string[]; 
  };
  message?: string | null;
} | undefined;


export async function createEvent(state: EventFormState, formData: FormData): Promise<EventFormState> {

  const rawDistances = formData.getAll('distances') as string[];
  const rawMeals = formData.getAll('meals') as string[];
  const rawAccommodations = formData.getAll('accommodations') as string[];

  const dataForValidation = {
    ...Object.fromEntries(formData.entries()),
    distances: rawDistances,
    meals: rawMeals,
    accommodations: rawAccommodations
  };

  const validatedFields = eventSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }


  const { title, dateStart, dateEnd, place, eventtype, description, picture, distances, meals, accommodations } = validatedFields.data;

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
        meals: meals || [],
        accommodations: accommodations || [],
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
  const rawMeals = formData.getAll('meals') as string[];
  const rawAccommodations = formData.getAll('accommodations') as string[];

  const distancesRenamesStr = formData.get('distances_renames') as string;
  const mealsRenamesStr = formData.get('meals_renames') as string;
  const accommodationsRenamesStr = formData.get('accommodations_renames') as string;

  const dataForValidation = {
    ...Object.fromEntries(formData.entries()),
    distances: rawDistances,
    meals: rawMeals,
    accommodations: rawAccommodations
  };

  // 2. Validation
  const validatedFields = eventUpdateSchema.safeParse(dataForValidation);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, dateStart, dateEnd, place, eventtype, description, picture, distances, meals, accommodations } = validatedFields.data;
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
      distances: distances || [],
      meals: meals || [],
      accommodations: accommodations || [],
    };

    if (picture instanceof File && picture.size > 0) {
      const imageUrlPath = await saveUploadedFile(
        picture,
        "uploads/events",
        title || "event"
      );
      dataToUpdate.imgUrl = imageUrlPath; 
    }

    await prisma.event.update({
      where: { id: eventId },
      data: dataToUpdate,
    }); 

    // Gérer les renommages pour les inscriptions existantes
    try {
      const distancesRenames = distancesRenamesStr ? JSON.parse(distancesRenamesStr) : [];
      const mealsRenames = mealsRenamesStr ? JSON.parse(mealsRenamesStr) : [];
      const accommodationsRenames = accommodationsRenamesStr ? JSON.parse(accommodationsRenamesStr) : [];

      if (distancesRenames.length > 0 || mealsRenames.length > 0 || accommodationsRenames.length > 0) {
        const registrations = await prisma.eventRegistration.findMany({
          where: { eventId }
        });

        const updates = registrations.map(reg => {
          let hasChanges = false;
          let newDistance = reg.distance;
          let newMeals = [...reg.meals];
          let newAccommodations = [...reg.accommodations];

          if (newDistance) {
            const rename = distancesRenames.find((r: any) => r.old === newDistance);
            if (rename) {
              newDistance = rename.new;
              hasChanges = true;
            }
          }

          mealsRenames.forEach((r: any) => {
            const idx = newMeals.indexOf(r.old);
            if (idx !== -1) {
              newMeals[idx] = r.new;
              hasChanges = true;
            }
          });

          accommodationsRenames.forEach((r: any) => {
            const idx = newAccommodations.indexOf(r.old);
            if (idx !== -1) {
              newAccommodations[idx] = r.new;
              hasChanges = true;
            }
          });

          if (hasChanges) {
            return prisma.eventRegistration.update({
              where: { id: reg.id },
              data: {
                distance: newDistance,
                meals: newMeals,
                accommodations: newAccommodations
              }
            });
          }
          return null;
        }).filter(Boolean);

        if (updates.length > 0) {
          await Promise.all(updates);
        }
      }
    } catch (renameError) {
      console.error("Erreur lors de la mise à jour des inscriptions (renommage):", renameError);
    }

    revalidatePath("/evenements"); //
    revalidatePath(`/evenements/${eventId}`); //
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

  revalidatePath("/evenements");
}

//========JOIN EVENT=========
export async function joinEventAction(eventId: string, distance: string | null = null, selectedMeals: string[] = [], selectedAccommodations: string[] = [], carpooling: boolean = false) {

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
        distance: distance,
        meals: selectedMeals,
        accommodations: selectedAccommodations,
        carpooling: carpooling
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



export async function exportEventParticipantsAction(eventId: string, targetParticipation?: string) {
    const user = await getCurrentUser();   

    if (user?.role !== "ADMIN") {
        return { success: false, message: "Seul un administrateur peut exporter ces données." };
    }


    const event = await getEventParticipantsForExport(eventId);

    if (!event) {
        return { success: false, message: "Événement introuvable" };
    }

    let registrationsToExport = event.registrations;
    if (targetParticipation) {
        registrationsToExport = event.registrations.filter(
            reg => reg.distance === targetParticipation || reg.meals.includes(targetParticipation) || reg.accommodations.includes(targetParticipation)
        );
    }

    if (registrationsToExport.length === 0) {
        return { success: false, message: "Aucun participant avec cette option." };
    }

    const csvHeader = "Nom;Prénom;Email;Téléphone;Distance;Repas;Hébergement;Covoiturage\n";
    
    const csvRows = registrationsToExport.map(reg => {
        const lastname = reg.user.lastname.replace(/;/g, ' ');
        const name = reg.user.name.replace(/;/g, ' ');
        const email = reg.user.email.replace(/;/g, ' ');
        const phone = reg.user.phone?.replace(/;/g, ' ') || "";
        const distanceStr = reg.distance || "Général";
        const mealsStr = reg.meals.length > 0 ? reg.meals.join(", ") : "Aucun";
        const accStr = reg.accommodations.length > 0 ? reg.accommodations.join(", ") : "Aucun";
        const carpoolingStatus = reg.carpooling ? "Oui" : "Non";
        
        return `${lastname};${name};${email};${phone};${distanceStr};${mealsStr};${accStr};${carpoolingStatus}`;
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