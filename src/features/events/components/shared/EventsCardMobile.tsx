"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "../../dal";
import { EventRowActions } from "../admin/EventRowAction";
import JoinEventButton from "../public/JointEventButton";
import { useUser } from "@/components/providers/UserProvider";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";


interface EventsProps {
    events: EventListItem[];
}

export default function EventsCardMobile({ events }: EventsProps) {
    const user = useUser();
    const pathname = usePathname();

    const isUserAdmin = user?.role === "ADMIN";
    const isAdminPage = pathname?.includes("/admin");
    const showAdminTools = isUserAdmin && isAdminPage;

    return (
        <div className="flex flex-col gap-4 lg:grid grid-cols-3 lg:gap-12">
            {events.map((event) => {
                return (
                    <Card key={event.id} className='border-none gap-1 shadow-md hover:shadow-lg transition-shadow duration-300 pt-0'>
                        <div className="relative w-full h-48">
                            <Image
                                src={event.imgUrl || '/images/login-hero.jpg'}
                                alt={event.title}
                                fill={true}
                                className="object-cover rounded-t-xl" // Important pour ne pas déformer l'image
                            />
                        </div>
                        <CardHeader className='pt-2 px-2'>
                            <div className="flex flex-row justify-between content-center items-center">
                                <CardTitle>{event.title}</CardTitle>
                                {showAdminTools && <EventRowActions eventId={event.id} />}
                            </div>
                            <CardDescription className='flex items-center gap-1'>
                                <Badge variant='outline' className='rounded-sm'>
                                    {event.dateStart
                                        ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                        : "La date n'est pas encore choisie"
                                    }
                                </Badge>
                                {event.dateEnd && (
                                    <>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        <Badge variant='outline' className='rounded-sm'>
                                            {new Date(event.dateEnd).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                        </Badge>
                                    </>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <div className="justify-between">
                            <CardContent className='pt-0 px-2'>
                                <p className='text-sm text-muted-foreground line-clamp-3'>
                                    {event.description}
                                </p>
                            </CardContent>
                            <CardFooter className='justify-between gap-3 max-sm:flex-col max-sm:items-stretch'>
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium uppercase'></span>
                                    <span className='text-xl font-semibold'></span>
                                </div>
                                {!isAdminPage && <JoinEventButton
                                    eventId={event.id}
                                    isParticipant={!!event.isParticipant}
                                />}
                            </CardFooter>
                        </div>
                    </Card>
                )
            })}
        </div>
    );
}