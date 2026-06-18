"use client"

import { useState } from "react";
import { EventListItem } from "../dal";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { getAssetUrl, formatEventType } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EventRowActions } from "./EventRowAction";
import AdminParticipantsModal from "./AdminParticipantsModal";
import { TypographyH3 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminEventCardList({ events }: { events: EventListItem[] }) {
    const [search, setSearch] = useState("");

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Rechercher un événement..." 
                    className="pl-10 h-10 bg-white border-slate-200 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEvents.map((event) => (
                    <Card
                        key={event.id}
                        className="group flex flex-col h-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-md overflow-hidden"
                    >
                        <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                            <img
                                src={getAssetUrl(event.imgUrl)}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2 flex gap-1">
                                <Badge className="bg-white/90 text-primary border-none font-bold uppercase text-[8px] px-1.5 h-4 rounded-sm">
                                    {formatEventType(event.type)}
                                </Badge>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col flex-grow">
                            <TypographyH3 className="text-sm leading-tight mb-3 line-clamp-1">
                                {event.title}
                            </TypographyH3>
                            <div className="absolute top-2 right-2">
                                <EventRowActions eventId={event.id} />
                            </div>
                            <div className="space-y-1.5 mb-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <Calendar size={12} className="text-primary/60 shrink-0" />
                                    <span>
                                        {event.dateStart ? new Date(event.dateStart).toLocaleDateString('fr-FR') : "À venir"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-primary/60 shrink-0" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                            </div>

                            <div className="mt-auto pt-3 border-t border-slate-50">
                                <AdminParticipantsModal
                                    eventId={event.id}
                                    eventTitle={event.title}
                                    participantCount={event.participantCount}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold italic uppercase text-xs">Aucun événement trouvé</p>
            )}
        </div>
    );
}
