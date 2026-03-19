// src/features/events/admin/EventsTableDesktop.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventRowActions } from "./EventRowAction";
import type { EventListItem } from "../dal";
import AdminParticipantsModal from "./AdminParticipantsModal";

interface EventsProps {
    events: EventListItem[];
}

export default function EventsTableDesktop({ events }: EventsProps) {
    return (
        <div className='overflow-hidden rounded-md border bg-background'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Date de début</TableHead>
                        <TableHead>Jusqu'à</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Participants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events?.map((event) => {
                        return (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>
                                    {event.dateStart
                                        ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                            day: "2-digit", month: "short", year: "numeric"
                                        })
                                        : "Pas de date"
                                    }
                                </TableCell>
                                <TableCell>
                                    {event.dateEnd
                                        ? new Date(event.dateEnd).toLocaleDateString("fr-FR", {
                                            day: "2-digit", month: "short", year: "numeric"
                                        })
                                        : "-"
                                    }
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>
                                    <span className="capitalize">{event.type.replace('_', ' ').toLowerCase()}</span>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center justify-center">
                                        <AdminParticipantsModal
                                            eventId={event.id}
                                            eventTitle={event.title}
                                            participantCount={event.participantCount}
                                        />
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <EventRowActions eventId={event.id} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}