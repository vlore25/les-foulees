import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EventListItem } from "../../dal";


interface EventsProps {
    events: EventListItem[];
}


export default function EventsTablePublic({ events }: EventsProps) {
    return (
        <div className='overflow-hidden rounded-md border'>
            <Table className="hidden lg:table">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Date de debut</TableHead>
                        <TableHead >Location</TableHead>
                        <TableHead >type</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events?.map((event) => {
                        return (
                            <TableRow key={event.id}>
                                <TableCell >{event.title}</TableCell>
                                <TableCell>
                                    {event.dateStart
                                        ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                        : "Pas de date"
                                    }
                                </TableCell>
                                <TableCell >{event.location}</TableCell>
                                <TableCell >{event.type}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}