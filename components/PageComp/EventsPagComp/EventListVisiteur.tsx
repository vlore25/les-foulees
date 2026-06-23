"use client"

import { useState } from "react";
import { EventListItem } from "@/src/features/events/dal";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn, getAssetUrl, formatEventType } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function EventListVisitor({ events }: { events: EventListItem[] }) {
    const [filter, setFilter] = useState<"future" | "past">("future");

    const now = new Date();

    const futureEventsCount = events.filter(event => {
        const eventDate = event.dateStart ? new Date(event.dateStart) : new Date();
        return eventDate >= now;
    })

    const filteredEvents = events.filter(event => {
        const eventDate = event.dateStart ? new Date(event.dateStart) : new Date();
        return filter === "future" ? eventDate >= now : eventDate < now;
    });

    return (
        <div className="space-y-12">
            {/* FILTRES */}
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

            {/* GRILLE DE RÉSULTATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {filteredEvents.map((event) => (
                    <Card
                        key={event.id}
                        className="group flex flex-col h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-tl-[2.5rem] rounded-br-[2.5rem]"
                    >
                        <div className="relative h-60 w-full overflow-hidden">
                            <img
                                src={getAssetUrl(event.imgUrl)}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
                            
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm border-none font-bold uppercase tracking-wider text-[10px]">
                                    {formatEventType(event.type)}
                                </Badge>
                            </div>

                            <div className="absolute bottom-4 left-6 right-6">
                                <h3 className="text-xl font-black uppercase text-white leading-tight line-clamp-2 drop-shadow-md">
                                    {event.title}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-muted-foreground font-bold text-xs italic">
                                    <Calendar size={16} className="text-primary shrink-0" />
                                    <span>
                                        {event.dateStart ? new Date(event.dateStart).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : "Date à venir"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground font-bold text-xs italic">
                                    <MapPin size={16} className="text-primary shrink-0" />
                                    <span className="line-clamp-1">{event.location}</span>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground/90 line-clamp-3 font-medium leading-relaxed italic">
                                {event.description || "Aucune description disponible."}
                            </p>

                            <div className="pt-4 mt-auto border-t border-primary/5 flex justify-end">
                                <Link href={`/evenements/${event.id}`} className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm group/link">
                                    <span>En savoir plus</span>
                                    <div className="p-1.5 rounded-full bg-primary/5 group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-muted/50">
                    <p className="text-muted-foreground font-black uppercase tracking-widest italic opacity-60">
                        Aucun événement {filter === "future" ? "prévu pour le moment" : "enregistré"}
                    </p>
                </div>
            )}
        </div>
    );
}
