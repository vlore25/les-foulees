import { prisma } from "@/src/lib/prisma";
import { cache } from "react";


export type EventListItem = {
  id: string;
  title: string;
  imgUrl: string;
  description: string | null;
  dateStart: Date | null;
  location: string;
  type: string;
}


//GET ALL EVENTS
export async function getAllevents(): Promise<EventListItem[]> {

  const events = await prisma.event.findMany({
    select: {
      id: true,
      title: true,
      imgUrl: true,
      description: true,
      dateStart: true,
      location: true,
      type: true,
    },
    orderBy: { dateStart: 'asc' }
  });

  return events;

}


export const getEventById = cache(async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  return event;
});
