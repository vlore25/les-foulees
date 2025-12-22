import { Button } from "@/components/ui/button";
import { ChevronRight, MapPinIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import JoinEventButton from "./JointEventButton"; // Vérifie que le chemin d'import est bon
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EventDetailsProps {
    event: {
        imgUrl: string
        title: string
        type: string
        _count: { participants: number }
        isParticipant: boolean
        participants: {
            id: string
            name: string
            lastname: string 
        }[]
        id: string
        dateStart: Date | null // Important: peut être null selon ton Prisma schema
        dateEnd: Date | null
        location: string
        description: string | null
    }
}

export default function EventDetails({ event }: EventDetailsProps) {
    console.log(event)
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
                            <Badge variant='outline' size="default" className='rounded-md md:text-base md:px-4 md:py-1.5'>
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
                                    <Badge variant='outline' size="default" className='rounded-md md:text-base md:px-4 md:py-1.5'>
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

                    {/* Bouton d'action (Rejoindre) */}
                    <div className="shrink-0 pt-1">
                        <h2>{event.location}</h2>
                    </div>
                </div>
            </div>
            <div>
                {!event._count.participants ? (
                    <p className="text-sm text-muted-foreground italic">
                        Pas de participant pour le moment, sois le premier !
                    </p>
                ) : (
                    <div className="flex items-center gap-0 lg:gap-2 ">
                        <Dialog>
                            <DialogTrigger>
                                <h3>
                                    Voir liste de participants ({event._count.participants})
                                </h3>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Participants {event.title}</DialogTitle>
                                </DialogHeader>

                                <div className="max-h-[60vh] pr-4">
                                    {/* Liste simple sans avatars */}
                                    <div className="flex flex-col mt-2">
                                        {event.participants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                className="py-3 border-b last:border-0 flex items-center justify-between"
                                            >
                                                <span className="text-sm">
                                                    {participant.name} <span className="font-semibold uppercase">{participant.lastname}</span>
                                                </span>
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
                    isParticipant={!!event.isParticipant}
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