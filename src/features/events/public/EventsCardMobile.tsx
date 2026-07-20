// src/features/events/public/EventsCardMobile.tsx

"use client";
import { useState } from "react";
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
    const [filter, setFilter] = useState<"future" | "past">("future");

    const now = new Date();
    const futureEventsCount = events.filter(event => {
        const eventDate = event.dateStart ? new Date(event.dateStart) : new Date();
        return eventDate >= now;
    });

    const filteredEvents = events.filter(event => {
        const eventDate = event.dateStart ? new Date(event.dateStart) : new Date();
        return filter === "future" ? eventDate >= now : eventDate < now;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-center">
                <div className="inline-flex bg-muted/50 p-1.5 rounded-tl-lg rounded-br-lg border shadow-sm">
                    <button
                        onClick={() => setFilter("future")}
                        className={cn(
                            "px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300",
                            filter === "future"
                                ? "bg-primary text-white shadow-md rounded-tl-lg rounded-br-lg"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        À venir ({futureEventsCount.length})
                    </button>
                    <button
                        onClick={() => setFilter("past")}
                        className={cn(
                            "px-6 py-2.5 text-sm font-black uppercase tracking-widest transition-all duration-300",
                            filter === "past"
                                ? "bg-primary text-white shadow-md rounded-tl-lg rounded-br-lg"
                                : "text-muted-foreground hover:text-primary"
                        )}
                    >
                        Passés
                    </button>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="text-center py-16 bg-muted/20 rounded-[2rem] border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-black uppercase tracking-widest italic opacity-60">
                        Aucun événement {filter === "future" ? "prévu pour le moment" : "enregistré"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {filteredEvents.map((event) => {
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
                                        {event.isParticipant ? "Gérer mon inscription" : "En savoir plus"}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )
                    })}
                </div>
            )}
        </div>
    );
}
