// src/features/events/components/shared/EventsCardMobile.tsx

"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "../dal";
import JoinEventButton from "../public/JointEventButton";
import { useUser } from "@/components/providers/UserProvider";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
                    <Card key={event.id} className='border-none gap-1 shadow-md hover:shadow-lg transition-shadow duration-300 pt-0 overflow-hidden flex flex-col h-full'>
                        <Link href={`/espace-membre/evenements/${event.id}`} className="block cursor-pointer hover:opacity-95 transition-opacity">
                            <div className="relative w-full h-48">
                                <Image
                                    src={event.imgUrl || '/images/login-hero.jpg'}
                                    alt={event.title}
                                    fill={true}
                                    className="object-cover"
                                />
                            </div>
                            <CardHeader className='pt-4 px-4 pb-2'>
                                <div className="flex flex-row justify-between content-center items-center">
                                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                                </div>
                                <CardDescription className='flex items-center gap-1 flex-wrap'>
                                    <Badge variant='outline' className='rounded-sm'>
                                        {event.dateStart
                                            ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            })
                                            : "Date à définir"
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
                        </Link>

                        <div className="flex flex-col flex-grow justify-between">
                            <CardContent className='pt-0 px-4'>
                                <p className='text-sm text-muted-foreground line-clamp-3'>
                                    {event.description}
                                </p>
                            </CardContent>
                            <CardFooter className='px-4 pb-4 pt-2 justify-between gap-3'>
                                <div className='flex flex-col'>
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