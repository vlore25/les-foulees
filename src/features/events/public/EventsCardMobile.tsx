// src/features/events/public/EventsCardMobile.tsx

"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "../dal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { getAssetUrl, formatEventType } from "@/src/lib/utils";
import { TypographyH3, TypographyP, TypographyDetail } from "@/components/ui/typography";

interface EventsProps {
    events: EventListItem[];
}

export default function EventsCardMobile({ events }: EventsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {events.map((event) => {
                return (
                    <Card 
                        key={event.id} 
                        className="group border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-white rounded-tl-[2.5rem] rounded-none"
                    >
                        <Link href={`/espace-membre/evenements/${event.id}`} className="block relative h-52 overflow-hidden">
                            <img
                                src={getAssetUrl(event.imgUrl)}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm border-none font-bold uppercase tracking-wider text-[10px]">
                                    {formatEventType(event.type)}
                                </Badge>
                            </div>
                        </Link>

                        <div className="flex flex-col flex-grow p-5 space-y-4">
                            <div className="space-y-2">
                                <Link href={`/espace-membre/evenements/${event.id}`}>
                                    <TypographyH3 className="line-clamp-2 hover:text-primary/80 transition-colors">
                                        {event.title}
                                    </TypographyH3>
                                </Link>
                                
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        <TypographyDetail>
                                            {event.dateStart
                                                ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })
                                                : "À définir"
                                            }
                                        </TypographyDetail>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <TypographyDetail className="line-clamp-1">{event.location}</TypographyDetail>
                                    </div>
                                </div>
                            </div>

                            <TypographyP className="line-clamp-3">
                                {event.description}
                            </TypographyP>

                            <div className="pt-2 mt-auto border-t border-primary/5 flex items-center justify-between gap-3">
                                <Button asChild className="w-full" variant={event.isParticipant ? "secondary" : "default"}>
                                    <Link href={`/espace-membre/evenements/${event.id}`}>
                                        {event.isParticipant ? "Gérer mon inscription" : "Savoir plus"}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    );
}
