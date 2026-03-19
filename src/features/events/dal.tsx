import { prisma } from "@/src/lib/prisma";
import { getSession, verifySession } from "@/src/lib/session";
import { cache } from "react";
import { getCurrentUser } from "../users/dal";


export type EventListItem = {
  id: string;
  title: string;
  imgUrl: string;
  description: string | null;
  dateStart: Date | null;
  dateEnd: Date | null;
  location: string;
  type: string;
  distances: string[]; // NOUVEAU
  isParticipant: boolean; // CORRIGÉ : Plus de "?", c'est un booléen strict
  selectedDistance: string | null; // NOUVEAU
  participantCount: number;
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
      distances: true, // 2. On récupère les distances de l'événement
      // 3. CORRIGÉ : Utilisation de "registrations" au lieu de "participants"
      registrations: {
        where: { userId: userId ?? "" },
        select: { distance: true } // On récupère la distance choisie par l'utilisateur
      },
      _count: {
        select: { registrations: true }
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
    distances: event.distances,
    isParticipant: event.registrations.length > 0, 
    selectedDistance: event.registrations[0]?.distance || null, 
    participantCount: event._count.registrations
  }));
}

// GET EVENT BY ID
export const getEventById = cache(async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return event;
});

// GET EVENT AND PARTICIPANTS
export const getEventWithParticipationStatus = cache(async (eventId: string) => {
  if (!eventId) return null;
  const session = await verifySession(); 
  const userId = session?.userId;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      // NOUVEAU : On inclut TOUTES les inscriptions avec le profil des utilisateurs
      registrations: {
        include: {
          user: {
            select: { id: true, name: true, lastname: true }
          }
        }
      },
      _count: { select: { registrations: true } }
    }
  });

  if (!event) return null;

  // On vérifie si l'utilisateur actuel (userId) se trouve dans la liste des inscrits
  const userRegistration = event.registrations.find(reg => reg.userId === userId) || null;
  const isParticipant = !!userRegistration;

  return { 
    ...event, 
    isParticipant,
    selectedDistance: userRegistration?.distance || null,
    participantCount: event._count.registrations
  };
});

export async function getEventsCountCurrentYear(): Promise<number> {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

  const count = await prisma.event.count({
    where: {
      dateStart: {
        gte: startOfYear, 
        lte: endOfYear,   
      },
    },
  });

  return count;
}

export async function getEventParticipantsForExport(eventId: string) {

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            title: true,
            registrations: {
                include: {
                    user: {
                        select: { name: true, lastname: true, email: true, phone: true }
                    }
                }
            }
        }
    });

    return event;
}

export async function getEventParticipantsListAction(eventId: string) {
    const user = await getCurrentUser()
    
    // SÉCURITÉ : Seulement pour l'admin
    if (user?.role !== 'ADMIN') {
        return { success: false, data: [] };
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            registrations: {
                include: {
                    user: { select: { name: true, lastname: true } }
                }
            }
        }
    });

    return { success: true, data: event?.registrations || [] };
}

