import { getEventById } from "@/src/features/events/dal";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/title";
import { Quote } from "@/components/ui/quote";
import { notFound } from "next/navigation";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAssetUrl, formatEventType } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Params = Promise<{ id: string }>;

export default async function EventDetailsPage({ params }: { params: Params }) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    const dateStart = event.dateStart ? new Date(event.dateStart) : null;

    return (
        <Container className="py-12">
            <Link 
                href="/evenements" 
                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs mb-8 hover:translate-x-1 transition-transform"
            >
                <ArrowLeft size={16} />
                Retour au calendrier
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* COLONNE GAUCHE : IMAGE & INFOS */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative aspect-video w-full overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] shadow-2xl border-4 border-white">
                        <img
                            src={getAssetUrl(event.imgUrl)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 left-6">
                            <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-md border-none font-bold uppercase tracking-widest px-4 py-1.5 shadow-lg">
                                {formatEventType(event.type)}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Title className="text-4xl lg:text-5xl">{event.title}</Title>
                        
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-muted-foreground leading-relaxed italic whitespace-pre-wrap font-medium">
                                {event.description || "Aucune description détaillée n'est disponible pour cet événement."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : INFOS PRATIQUES */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-tl-[2.5rem] rounded-br-[2.5rem] shadow-xl border border-primary/5 space-y-8 sticky top-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                            Infos Pratiques
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Calendar size={24} className="text-primary shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Date</p>
                                    <p className="font-bold text-slate-700 italic">
                                        {dateStart ? dateStart.toLocaleDateString('fr-FR', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        }) : "À venir"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin size={24} className="text-primary shrink-0 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Lieu</p>
                                    <p className="font-bold text-slate-700 italic">{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button asChild className="w-full py-6 font-black uppercase tracking-widest text-xs">
                                <Link href="/contact">
                                    S'inscrire au club
                                </Link>
                            </Button>
                            <p className="text-[10px] text-center mt-4 text-muted-foreground italic font-medium">
                                L'inscription aux événements est réservée aux membres du club.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
