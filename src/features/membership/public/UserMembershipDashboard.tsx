'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import ErrorCard from "@/components/common/feedback/ErrorCard";
import { MembershipForm } from "./MembershipForm";
import { MembershipStatus } from "@/prisma/generated/enums";
import { Title2 } from "@/components/ui/title2";
import { memberCardPdf } from "../memberCardPdf";

const STATUS_INFO = {
    [MembershipStatus.PENDING]: {
        label: "En attente de validation",
        color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
        icon: Clock
    },
    [MembershipStatus.VALIDATED]: {
        label: "Adhésion Validée",
        color: "bg-green-500/10 text-green-700 border-green-200",
        icon: CheckCircle
    },
    [MembershipStatus.REJECTED]: {
        label: "Dossier Refusé",
        color: "bg-red-500/10 text-red-700 border-red-200",
        icon: AlertCircle
    },
};

const TYPE_LABELS: Record<string, string> = {
    INDIVIDUAL: "Individuel",
    YOUNG: "Jeune (-18)",
    LICENSE_RUNNING: "Licence Running (FFA)"
};

interface UserMembershipDashboardProps {
    user: any;
    season: any;
    membership: any;
}

export default function UserMembershipDashboard({ user, season, membership }: UserMembershipDashboardProps) {

    if (!season) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
                <ErrorCard
                    title="Inscriptions fermées"
                    message="Aucune saison n'est ouverte aux inscriptions pour le moment."
                />
            </div>
        );
    }

    if (membership && membership.status !== 'REJECTED') {
        const status = membership.status as MembershipStatus;
        const info = STATUS_INFO[status] || STATUS_INFO.PENDING;
        const Icon = info.icon;

        return (
            <div className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-0">
                <Card className="rounded-lg shadow-sm border-slate-200">
                    <CardHeader className="pb-4 sm:pb-6">
                        <Title2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Mon Adhésion {season.name}
                        </Title2>
                    </CardHeader>

                    <CardContent className="space-y-6 sm:space-y-8">
                        {/* Grille responsive pour les infos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-muted-foreground">État du dossier</p>
                                <Badge variant="outline" className={`${info.color} gap-1.5 py-1 px-3 w-fit text-sm`}>
                                    <Icon className="w-4 h-4" />
                                    <span>{info.label}</span>
                                </Badge>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-muted-foreground">Type d'adhésion</p>
                                <p className="font-semibold text-base sm:text-lg text-slate-900">
                                    {TYPE_LABELS[membership.type] || membership.type}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-sm font-medium text-muted-foreground">Date de demande</p>
                                <p className="font-semibold text-base sm:text-lg text-slate-900">
                                    {new Date(membership.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>

                        {status === 'VALIDATED' ? (
                            <Button onClick={() => memberCardPdf({
                                userData: user,
                                memberShipData: membership,
                                season: season
                            })}>
                                Télécharger la carte
                            </Button>

                        ) : (
                            <div className="flex items-start gap-3 bg-yellow-500/10 p-4 rounded-lg text-yellow-700 border border-yellow-200 text-sm">
                                <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>Votre dossier est en cours de validation par le bureau. Vous serez notifié dès que le processus sera terminé.</p>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="pt-2 pb-6 px-6">
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-4 sm:px-0">
            {membership && membership.status === 'REJECTED' && (
                <ErrorCard
                    title="Action requise : Dossier refusé"
                    message="Votre précédente demande n'a pas pu être validée. Veuillez corriger les informations ci-dessous et soumettre à nouveau."
                />
            )}

            <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {membership ? "Corriger ma demande" : "Nouvelle Adhésion"}
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Rejoignez Les Foulées pour la saison <span className="font-semibold text-primary">{season.name}</span>.
                </p>
            </div>

            <div className="bg-white rounded-lg sm:border sm:shadow-sm sm:p-6">
                <MembershipForm
                    userProfile={user}
                    season={season}
                    initialData={membership}
                />
            </div>
        </div>
    );
}