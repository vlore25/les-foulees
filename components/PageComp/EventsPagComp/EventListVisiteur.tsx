"use client"

import { useState } from "react";
import { EventListItem } from "@/src/features/events/dal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

export default function EventListVisitor({ events }: { events: EventListItem[] }) {
    const [filter, setFilter] = useState<"future" | "past">("future");

    const now = new Date();


    const filteredEvents = events.filter(event => {
        const eventDate = event.dateStart ? new Date(event.dateStart) : new Date();
        return filter === "future" ? eventDate >= now : eventDate < now;
    });

    return (
        <div className="space-y-10">
            <div className="flex justify-center">
                <div className="inline-flex bg-gray-100 p-1.5 rounded-tl-xl rounded-br-xl border border-gray-200 shadow-inner">
                    <button
                        onClick={() => setFilter("future")}
                        className={cn(
                            "px-8 py-2.5 text-sm font-black font-medium tracking-widest transition-all duration-300",
                            filter === "future"
                                ? "bg-primary text-white shadow-lg rounded-tl-xl rounded-br-xl"
                                : "text-gray-500 hover:text-primary"
                        )}
                    >
                        À venir
                    </button>
                    <button
                        onClick={() => setFilter("past")}
                        className={cn(
                            "px-8 py-2.5 text-sm font-black font-medium tracking-widest transition-all duration-300",
                            filter === "past"
                                ? "bg-primary text-white shadow-lg rounded-tl-xl rounded-br-xl"
                                : "text-gray-500 hover:text-primary"
                        )}
                    >
                        Événements passés
                    </button>
                </div>
            </div>
            {/* GRILLE DE RÉSULTATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {filteredEvents.map((event) => (
                    
                    <Card
                        key={event.id}
                        className="group flex flex-col h-full border-0 shadow-xl overflow-hidden bg-white p-y-0"
                    >
                        
                        <div className="relative h-56 w-full overflow-hidden">
                            <Image
                                src={event.imgUrl || "/images/login-hero.jpg"}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold uppercase px-3 py-1 rounded-tl-md rounded-br-md backdrop-blur-sm">
                                {event.type}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-black uppercase text-primary-800 leading-tight mb-4">
                                {event.title}
                            </h3>
                            <div className="space-y-2 mt-auto">
                                <div className="flex items-center gap-3 text-gray-500 font-semibold text-sm italic">
                                    <Calendar size={18} className="text-primary" />
                                    <span>
                                        {event.dateStart ? new Date(event.dateStart).toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : "Date à venir"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 font-semibold text-sm italic">
                                    <MapPin size={18} className="text-primary" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500 font-semibold text-sm italic">
                                    <span>{event.description}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-widest italic">
                        Aucun événement {filter === "future" ? "prévu pour le moment" : "enregistré dans l'historique"}
                    </p>
                </div>
            )}
        </div>
    );
}