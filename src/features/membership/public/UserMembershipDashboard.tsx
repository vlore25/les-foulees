'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, Download, Calendar, User, FileText } from "lucide-react";
import ErrorCard from "@/components/common/feedback/ErrorCard";
import { MembershipForm } from "./MembershipForm";
import { MembershipStatus } from "@/prisma/generated/enums";
import { memberCardPdf } from "../memberCardPdf";
import { cn } from "@/src/lib/utils";
import { TypographyH1, TypographyH3, TypographyPageDescription, TypographyP, TypographyDetail } from "@/components/ui/typography";

const STATUS_INFO = {
    [MembershipStatus.PENDING]: {
        label: "En attente",
        color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
        icon: Clock
    },
    [MembershipStatus.VALIDATED]: {
        label: "Validée",
        color: "bg-green-500/10 text-green-700 border-green-200",
        icon: CheckCircle
    },
    [MembershipStatus.REJECTED]: {
        label: "Refusée",
        color: "bg-red-500/10 text-red-700 border-red-200",
        icon: AlertCircle
    },
};

const TYPE_LABELS: Record<string, string> = {
    INDIVIDUAL: "Individuel",
    YOUNG: "Jeune (-18)",
    LICENSE_RUNNING: "Licence Running (FFA)",
    COUPLE: "Couple"
};

interface UserMembershipDashboardProps {
    user: any;
    season: any;
    membership: any;
}

export default function UserMembershipDashboard({ user, season, membership }: UserMembershipDashboardProps) {

    if (!season) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4">
                <ErrorCard
                    title="Inscriptions fermées"
                    message="Aucune saison n'est ouverte aux inscriptions pour le moment."
                />
            </div>
        );
    }

    // Un partenaire invité n'a pas encore rempli ses infos (certificat/licence) 
    // s'il n'a ni n° de licence ni certificat, mais qu'il a une adhésion de type COUPLE
    const isIncompletePartner = membership && 
        membership.type === 'COUPLE' && 
        !membership.ffaLicenseNumber && 
        !membership.certificateUrl &&
        membership.status === 'PENDING';

    if (membership && membership.status !== 'REJECTED' && !isIncompletePartner) {
        const status = membership.status as MembershipStatus;
        const info = STATUS_INFO[status] || STATUS_INFO.PENDING;
        const Icon = info.icon;

        return (
            <div className="w-full max-w-4xl mx-auto space-y-8 px-2">
                <div className="relative overflow-hidden bg-white rounded-tl-[3rem] rounded-br-[3rem] border-none shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
                    
                    <div className="p-8 sm:p-12 relative">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div className="space-y-2">
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-black uppercase tracking-widest text-xs px-3 py-1">
                                    Saison {season.name}
                                </Badge>
                                <TypographyH1 className="text-3xl sm:text-4xl text-slate-900">
                                    Mon Adhésion
                                </TypographyH1>
                            </div>
                            
                            <div className={cn(
                                "flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold uppercase tracking-widest text-sm",
                                info.color
                            )}>
                                <Icon className="w-5 h-5" />
                                <span>{info.label}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            <div className="space-y-3 p-6 bg-muted/30 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-2 text-primary">
                                    <User size={14} />
                                    <TypographyDetail className="text-primary not-italic">Type d'offre</TypographyDetail>
                                </div>
                                <TypographyP className="text-xl font-bold text-slate-800 italic">
                                    {TYPE_LABELS[membership.type] || membership.type}
                                </TypographyP>
                            </div>

                            <div className="space-y-3 p-6 bg-muted/30 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-2 text-primary">
                                    <Calendar size={14} />
                                    <TypographyDetail className="text-primary not-italic">Date de demande</TypographyDetail>
                                </div>
                                <TypographyP className="text-xl font-bold text-slate-800 italic">
                                    {new Date(membership.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </TypographyP>
                            </div>

                            <div className="space-y-3 p-6 bg-muted/30 rounded-2xl border border-primary/5">
                                <div className="flex items-center gap-2 text-primary">
                                    <FileText size={14} />
                                    <TypographyDetail className="text-primary not-italic">Paiement</TypographyDetail>
                                </div>
                                <TypographyP className="text-xl font-bold text-slate-800 italic">
                                    {membership.paymentMethod || "Virement"}
                                </TypographyP>
                            </div>
                        </div>

                        {status === 'VALIDATED' ? (
                            <div className="flex justify-center pt-4">
                                <Button 
                                    onClick={() => memberCardPdf({
                                        userData: user,
                                        memberShipData: membership,
                                        season: season
                                    })}
                                    className="px-8 py-6 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 text-sm"
                                >
                                    <Download size={20} />
                                    Télécharger ma carte
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                <Clock className="w-6 h-6 shrink-0 mt-0.5 text-primary" />
                                <div className="space-y-1">
                                    <TypographyH3 className="text-base tracking-tight">Dossier en cours d'examen</TypographyH3>
                                    <TypographyP className="text-slate-600 italic">Votre demande est en cours de validation par le bureau. Un email de confirmation vous sera envoyé prochainement.</TypographyP>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 px-2">
            {membership && membership.status === 'REJECTED' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <ErrorCard
                        title="Dossier incomplet ou refusé"
                        message="Votre précédente demande n'a pas pu être validée. Veuillez corriger les points indiqués et soumettre à nouveau le formulaire."
                    />
                </div>
            )}

            <div className="space-y-3 text-center md:text-left">
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-xs px-3 py-1">
                    Saison {season.name}
                </Badge>
                <TypographyH1>
                    {membership ? "Corriger ma demande" : "Nouvelle Adhésion"}
                </TypographyH1>
                <TypographyPageDescription>
                    Rejoignez les Foulées Avrillaises pour une nouvelle saison de course et de convivialité.
                </TypographyPageDescription>
            </div>

            <MembershipForm
                userProfile={user}
                season={season}
                initialData={membership}
            />
        </div>
    );
}
