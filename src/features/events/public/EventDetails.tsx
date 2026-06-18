import { Button } from "@/components/ui/button";
import { ChevronRight, MapPinIcon, TagIcon, CalendarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import JoinEventButton from "./JointEventButton";
import { Badge } from "@/components/ui/badge";
import { getAssetUrl, formatEventType } from "@/src/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Quote } from "@/components/ui/quote";
import { TypographyH1, TypographyH4, TypographyP } from "@/components/ui/typography";

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
        meals: string[];
        accommodations: string[];
        isParticipant: boolean;
        userDistance: string | null;
        userMeals: string[];
        userAccommodations: string[];
        participantCount: number;
        registrations: {
            id: string;
            distance: string | null;
            meals: string[];
            accommodations: string[];
            carpooling: boolean;
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
        const distanceLabel = reg.distance || "Général";
        const mealsLabel = reg.meals?.length > 0 ? ` + ${reg.meals.join(", ")}` : "";
        const accLabel = reg.accommodations?.length > 0 ? ` + ${reg.accommodations.join(", ")}` : "";
        
        const finalLabel = `${distanceLabel}${mealsLabel}${accLabel}`;
        if (!acc[finalLabel]) {
            acc[finalLabel] = [];
        }
        acc[finalLabel].push(reg);
        return acc;
    }, {} as Record<string, typeof event.registrations>);

    return (
        <div className="max-w-5xl mx-auto px-2 pb-12 sm:px-2 lg:px-2 space-y-6 sm:space-y-8 animate-in fade-in duration-500">
            {/* Navigation & Breadcrumb */}
            <div className="pt-4">
                <Button variant="ghost" asChild className="-ml-2 px-2 h-9 text-muted-foreground hover:text-foreground transition-colors">
                    <Link href="/espace-membre/evenements" className="flex items-center gap-1.5 text-sm font-medium">
                        ← Retour aux événements
                    </Link>
                </Button>
            </div>

            {/* Hero Section */}
            <div className="flex flex-col lg:gap-8 xl:gap-12 items-start">
                
                {/* Image Section */}
                <div className="lg:col-span-7 xl:col-span-8 w-full order-1">
                    <div className="relative aspect-[16/9] w-full overflow-hidden shadow-lg border bg-muted group">
                        <img
                            src={getAssetUrl(event.imgUrl)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Main Info Card */}
                <div className="lg:col-span-5 xl:col-span-4 w-full mt-6 lg:mt-0 space-y-6 order-2 lg:sticky lg:top-8">
                    <div className="space-y-2">
                        <TypographyH1>
                            {event.title}
                        </TypographyH1>

                        <div className="space-y-1">
                            {/* Date Info */}
                            <div className="flex items-center gap-1">
                                <div className="p-2 text-primary">
                                    <CalendarIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 flex-wrap">
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
                            <div className="flex items-center gap-1">
                                <div className="p-2 text-primary">
                                    <MapPinIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold sm:text-base leading-snug">
                                        {event.location}
                                    </p>
                                </div>
                            </div>

                            {/* Activity Type Info */}
                            <div className="flex items-center gap-1">
                                <div className="p-2 text-primary">
                                    <TagIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold sm:text-base">
                                        {formatEventType(event.type)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="p-2 text-primary">
                                    <UsersIcon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    {!event.participantCount ? (
                                        <p className="text-sm font-semibold sm:text-base">
                                            Aucun inscrit pour le moment.
                                        </p>
                                    ) : (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="text-sm font-semibold sm:text-base text-primary hover:text-primary/80 transition-colors text-left hover:underline underline-offset-4 hover:cursor-pointer">
                                                    Liste des participants ({event.participantCount})
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[450px] rounded-md overflow-hidden p-0 gap-0">
                                            <div className="p-6 text-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-black tracking-tight border-b">
                                                        Participants : {event.title.toLowerCase()}
                                                    </DialogTitle>
                                                </DialogHeader>
                                            </div>

                                            <div className="max-h-[60vh] p-6 overflow-y-auto bg-background">
                                                <div className="flex flex-col gap-8">
                                                    {Object.entries(groupedRegistrations).map(([distance, regs]) => (
                                                        <div key={distance} className="space-y-4">
                                                            <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                                                                <TypographyH4>{distance.toLowerCase()}</TypographyH4>
                                                                <Badge variant="secondary" className="font-bold">
                                                                    {regs.length} {regs.length > 1 ? 'inscrits' : 'inscrit'}
                                                                </Badge>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                                                {regs.map((reg) => (
                                                                    <div key={reg.id} className="text-sm flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                                                        <span className="font-medium flex items-center gap-2">
                                                                            {reg.user.name} <span className="font-bold capitalize">{reg.user.lastname}</span>
                                                                            {reg.carpooling && (
                                                                                <span className="bg-primary/20 text-primary text-[10px] font-medium px-1.5 py-0.5 rounded-sm  text-nowrap" title="Propose un covoiturage">
                                                                                    Propose covoiturage
                                                                                </span>
                                                                            )}
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


                    {/* Registration & Participants */}
                    <div className="space-y-4 pt-2">
                        <div className="flex flex-col gap-4">
                            <JoinEventButton
                                eventId={event.id}
                                isParticipant={event.isParticipant}
                                distances={event.distances}
                                meals={event.meals}
                                accommodations={event.accommodations}
                                userDistance={event.userDistance}
                                userMeals={event.userMeals}
                                userAccommodations={event.userAccommodations}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="pt-4 lg:pt-8 lg:max-w-[58%]">
                <div className="space-y-6">
                    <Quote>À propos de l'événement</Quote>
                    <TypographyP className="whitespace-pre-wrap text-foreground text-base">
                        {event.description || "Aucune description fournie pour cet événement."}
                    </TypographyP>
                </div>
            </div>
        </div>
    );
}
