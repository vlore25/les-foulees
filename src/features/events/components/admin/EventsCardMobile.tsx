import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "../../dal";
import { Button } from "@/components/ui/button";
import { EventRowActions } from "./EventRowAction";

interface EventsProps {
    events: EventListItem[];
}

export default function EventsCardMobile({ events }: EventsProps) {
    return (
        <div className="flex flex-col gap-4 lg:hidden">
            {events.map((event) => {
                return (
                    <Card key={event.id} className='flex flex-row overflow-hidden max-w-lg p-0'>
                        <div className='w-1/3  relative'>
                            <img
                                src={event.imgUrl || '/images/login-hero.jpg'}
                                alt={event.title}
                                className='h-full w-full object-cover'
                            />
                        </div>

                        {/* COLONNE DROITE : CORPS */}
                        {/* flex-1 permet de prendre tout l'espace restant */}
                        <div className='flex flex-col flex-1 justify-between'>
                            <CardHeader className='p-4 pb-0'>
                                <div className="flex flex-row justify-between">
                                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                                <EventRowActions eventId={event.id}/>
                                </div>

                                <CardDescription>
                                    {event.dateStart ? new Date(event.dateStart).toLocaleDateString() : ''}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardFooter className='p-4 pt-2 justify-end'>
                    
                            </CardFooter>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}