'use server'

import { EventType } from "@/app/generated/prisma/enums";
import { verifySession } from "@/src/lib/dal";
import { eventSchema, eventUpdateSchema } from "@/src/lib/definitions";
import { prisma } from "@/src/lib/prisma";
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
        picture?: string[];
    };
    message?: string | null;
} | undefined;


//========CREATE EVENT=========
export async function createEvent(state: EventFormState, formData: FormData): Promise<EventFormState> {

    const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { title, dateStart, dateEnd, place, eventtype, description, picture } = validatedFields.data;


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
                imgUrl: imageUrlPath,
            },
        })

    }
    catch (e) {
        console.error("Erreur :", e);
        return { message: 'Une erreur s\'est produite, veuillez réessayer.' };
    }

    return { message: 'Evenement créé acec succes!' };
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

  const { title, dateStart, dateEnd, place, eventtype, description, picture } = validatedFields.data;
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

//========JOINT EVENT=========

export async function joinEventAction(eventId: string) {
  
  // 2. On récupère la session
  const session = await verifySession();
  
  // 3. VÉRIFICATION STRICTE
  // Si pas de session OU pas d'userId OU userId est vide -> on arrête tout.
  if (!session || !session.userId) {
     return { 
       success: false, 
       message: "Vous devez être connecté pour rejoindre un événement." 
     };
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          // 4. Ici, on est sûr que session.userId est une string valide
          connect: { id: session.userId } 
        }
      }
    })

    revalidatePath('/dashboard/evenements')
    revalidatePath(`/dashboard/evenement/${eventId}`) 
    
    return { success: true, message: "Inscription validée !" }

  } catch (error) {
    console.error("Erreur inscription event:", error)
    return { success: false, message: "Une erreur est survenue lors de l'inscription." }
  }
}

//========LEAVE EVENT=========
export async function leaveEventAction(eventId: string) {
  const session = await verifySession()
  if (!session?.userId) return { success: false, message: "Non autorisé" }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        participants: {
          disconnect: { id: session.userId } 
        }
      }
    })

    revalidatePath('/dashboard/evenements')
    revalidatePath(`/dashboard/evenement/${eventId}`)
    return { success: true, message: "Désinscription prise en compte." }
  } catch (error) {
    return { success: false, message: "Erreur lors de la désinscription." }
  }
}