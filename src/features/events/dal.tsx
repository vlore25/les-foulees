import { prisma } from "@/src/lib/prisma";



//GET ALL EVENTS
export async function getAllevents(){
    
    const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          imgUrl: true,
          description: true,
          dateStart : true, 
          location: true, 
        },
        orderBy: { dateStart: 'asc' }
      });

    if(events){
        return events;
    }
}