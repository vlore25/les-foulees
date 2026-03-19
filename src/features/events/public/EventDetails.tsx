import { Button } from "@/components/ui/button";
import { ChevronRight, MapPinIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JoinEventButton from "./JointEventButton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface EventDetailsProps {
    event: {
        id: string;
        title: string;
        imgUrl: string;
        description: string | null;
        location: string;
        type: string;
        dateStart: Date | null;
        dateEnd: Date | null;
        distances: string[];
        isParticipant: boolean;
        selectedDistance: string | null;
        participantCount: number;
        registrations: {
            id: string;
            distance: string | null;
            user: {
                id: string;
                name: string;
                lastname: string;
            };
        }[];
    }
}


export default function EventDetails({ event }: EventDetailsProps) {

    const groupedRegistrations = event.registrations.reduce((acc, reg) => {
        const distanceLabel = reg.distance || "Inscription classique";

        if (!acc[distanceLabel]) {
            acc[distanceLabel] = [];
        }
        acc[distanceLabel].push(reg);
        return acc;
    }, {} as Record<string, typeof event.registrations>);

    return (
        <div className="max-w-4xl mx-auto pb-10 space-y-8">
            <div>
                <Button variant="ghost" asChild className="pl-0 gap-2 text-muted-foreground hover:text-foreground">
                    <Link href="/espace-membre/evenements">← Retour aux événements</Link>
                </Button>
            </div>
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-md bg-muted">
                <Image
                    src={event.imgUrl || '/images/login-hero.jpg'}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{event.title}</h1>
                        <div className='flex items-center gap-1'>
                            <Badge variant='outline' className='rounded-md md:text-base md:px-4 md:py-1.5'>
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
                                    <Badge variant='outline' className='rounded-md md:text-base md:px-4 md:py-1.5'>
                                        {new Date(event.dateEnd).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </Badge>
                                </>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <TagIcon className="w-4 h-4" />
                            <span className="capitalize">{event.type.replace('_', ' ').toLowerCase()}</span>
                        </div>
                    </div>

                    <div className="shrink-0 pt-1 flex items-center gap-2 text-muted-foreground">
                        <MapPinIcon className="w-4 h-4" />
                        <h2>{event.location}</h2>
                    </div>
                </div>
            </div>
            <div>
                {!event.participantCount ? (
                    <p className="text-sm text-muted-foreground italic">
                        Pas de participant pour le moment, sois le premier !
                    </p>
                ) : (
                    <div className="flex items-center gap-0 lg:gap-2 ">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="px-0 text-md font-semibold">
                                    Voir liste de participants ({event.participantCount})
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Participants : {event.title}</DialogTitle>
                                </DialogHeader>

                                <div className="max-h-[60vh] pr-4 overflow-y-auto">
                                    <div className="flex flex-col mt-4 gap-6">
                                        {/* On boucle sur nos groupes de distances */}
                                        {Object.entries(groupedRegistrations).map(([distance, regs]) => (
                                            <div key={distance} className="space-y-2">
                                                {/* En-tête de la distance avec le nombre d'inscrits */}
                                                <div className="flex items-center justify-between border-b pb-1">
                                                    <h4 className="font-semibold text-primary">{distance}</h4>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {regs.length} {regs.length > 1 ? 'inscrits' : 'inscrit'}
                                                    </Badge>
                                                </div>

                                                {/* Liste des participants pour CETTE distance */}
                                                <div className="flex flex-col">
                                                    {regs.map((reg) => (
                                                        <div
                                                            key={reg.id}
                                                            className="py-2 flex items-center justify-between text-sm"
                                                        >
                                                            <span>
                                                                {reg.user.name} <span className="font-semibold uppercase">{reg.user.lastname}</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <JoinEventButton
                    eventId={event.id}
                    isParticipant={event.isParticipant}
                    distances={event.distances}
                    userDistance={event.selectedDistance}
                />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">À propos de l'événement</h2>
                <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {event.description || "Aucune description fournie pour cet événement."}
                </div>
            </div>
        </div>
    );
}