import { verifySession } from "@/src/lib/dal";
import { prisma } from "@/src/lib/prisma";
import { getSession } from "@/src/lib/session";
import { cache } from "react";


export type EventListItem = {
  id: string;
  title: string;
  imgUrl: string;
  description: string | null;
  dateStart: Date | null;
  dateEnd: Date | null;
  location: string;
  type: string;
  isParticipant?: boolean;

}


//GET ALL EVENTS
export async function getAllevents(): Promise<EventListItem[]> {
  const session = await getSession();
  const userId = session?.userId;

  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      imgUrl: true,
      description: true,
      dateStart: true,
      dateEnd: true,
      location: true,
      type: true,
      participants: {
        where: { id: userId ?? "" },
        select: { id: true }
      }
    },
    orderBy: { dateStart: 'asc' }
  });

  return events.map(event => ({
    id: event.id,
    title: event.title,
    imgUrl: event.imgUrl,
    description: event.description,
    dateStart: event.dateStart,
    dateEnd: event.dateEnd,
    location: event.location,
    type: event.type,
    isParticipant: event.participants.length > 0 
  }));

}

export const getEventById = cache(async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return event;
});

export const getEventWithParticipationStatus = cache(async (eventId: string) => {
  const session = await verifySession(); // Récupérer session côté serveur

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      participants: {
        where: { id: session?.userId || "invalid-id" }, // Filtre pour voir si JE suis dedans
        select: { id: true }
      },
      _count: { select: { participants: true } } // Compter le total
    }
  });

  if (!event) return null;

  // Si le tableau participants contient au moins un élément, c'est que je suis inscrit
  const isParticipant = event.participants.length > 0;

  return { ...event, isParticipant };
});
