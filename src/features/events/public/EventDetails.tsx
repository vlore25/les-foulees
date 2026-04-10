import { Button } from "@/components/ui/button";
import { ChevronRight, MapPinIcon, TagIcon, CalendarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import JoinEventButton from "./JointEventButton";
import { Badge } from "@/components/ui/badge";
import { getAssetUrl, formatEventType } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

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
        <div className="max-w-5xl mx-auto px-4 pb-12 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Navigation & Breadcrumb */}
            <div className="pt-4">
                <Button variant="ghost" asChild className="-ml-2 px-2 h-9 text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/espace-membre/evenements" className="flex items-center gap-1.5 text-sm font-medium">
                        ← Retour aux événements
                    </Link>
                </Button>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12 items-start">
                
                {/* Image Section */}
                <div className="lg:col-span-7 xl:col-span-8 w-full order-1">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border bg-muted group">
                        <img
                            src={getAssetUrl(event.imgUrl)}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider font-bold shadow-sm">
                                {formatEventType(event.type)}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Main Info Card */}
                <div className="lg:col-span-5 xl:col-span-4 w-full mt-6 lg:mt-0 space-y-6 order-2 lg:sticky lg:top-8">
                    <div className="space-y-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-primary leading-tight">
                            {event.title}
                        </h1>

                        <div className="space-y-3">
                            {/* Date Info */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Date</p>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-sm font-semibold sm:text-base">
                                            {event.dateStart
                                                ? new Date(event.dateStart).toLocaleDateString("fr-FR", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })
                                                : "À définir"
                                            }
                                        </span>
                                        {event.dateEnd && (
                                            <>
                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-semibold sm:text-base">
                                                    {new Date(event.dateEnd).toLocaleDateString("fr-FR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <MapPinIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Lieu</p>
                                    <p className="text-sm font-semibold sm:text-base leading-snug">
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            {/* Activity Type Info */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <TagIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Type</p>
                                    <p className="text-sm font-semibold sm:text-base">
                                        {formatEventType(event.type)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-primary/10" />

                    {/* Registration & Participants */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-col gap-4">
                            <JoinEventButton
                                eventId={event.id}
                                isParticipant={event.isParticipant}
                                distances={event.distances}
                                userDistance={event.selectedDistance}
                            />

                            <div className="flex items-center justify-between px-1">
                                {!event.participantCount ? (
                                    <p className="text-sm text-muted-foreground italic font-medium">
                                        Aucun inscrit pour le moment.
                                    </p>
                                ) : (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                                <UsersIcon className="w-4 h-4" />
                                                <span>Liste des participants ({event.participantCount})</span>
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[450px] rounded-2xl overflow-hidden p-0 gap-0">
                                            <div className="bg-primary p-6 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black uppercase tracking-tight">
                                                        Participants : {event.title}
                                                    </DialogTitle>
                                                </DialogHeader>
                                            </div>

                                            <div className="max-h-[60vh] p-6 overflow-y-auto bg-background">
                                                <div className="flex flex-col gap-8">
                                                    {Object.entries(groupedRegistrations).map(([distance, regs]) => (
                                                        <div key={distance} className="space-y-4">
                                                            <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                                                                <h4 className="font-black uppercase text-sm tracking-widest text-primary italic">{distance}</h4>
                                                                <Badge variant="secondary" className="font-bold">
                                                                    {regs.length} {regs.length > 1 ? 'inscrits' : 'inscrit'}
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                                {regs.map((reg) => (
                                                                    <div key={reg.id} className="text-sm flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                                        <span className="font-medium">
                                                                            {reg.user.name} <span className="font-bold uppercase">{reg.user.lastname}</span>
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="pt-4 lg:pt-8 lg:max-w-[58%]">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 border-b-2 border-primary pb-1">
                        <h2 className="text-xl font-black uppercase tracking-tight italic text-primary">À propos de l'événement</h2>
                    </div>
                    <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground/90 whitespace-pre-wrap leading-relaxed font-medium bg-muted/30 p-6 rounded-2xl border border-primary/5">
                        {event.description || "Aucune description fournie pour cet événement."}
                    </div>
                </div>
            </div>
        </div>
    );
}
