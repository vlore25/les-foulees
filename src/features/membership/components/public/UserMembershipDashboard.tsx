'use client'

import { MembershipForm } from "./MembershipForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { MembershipStatus, MembershipType } from "@/app/generated/prisma/enums";

// --- Types et Constantes (Locaux à la feature) ---

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
    COUPLE: "Couple",
    YOUNG: "Jeune (-18)",
    LICENSE_RUNNING: "Licence Running (FFA)"
};

interface UserMembershipDashboardProps {
    user: any;
    season: any;
    membership: any; // On passe l'adhésion complète
}

export default function UserMembershipDashboard({ user, season, membership }: UserMembershipDashboardProps) {

    // 1. CAS : Pas de saison active -> Inscriptions fermées
    if (!season) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" /> Inscriptions fermées
                    </CardTitle>
                    <CardDescription className="text-red-600">
                        Aucune saison n'est ouverte aux inscriptions pour le moment.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // 2. CAS : Dossier existant (PENDING ou VALIDATED) -> On affiche le Statut
    // Note : Si REJECTED, on passe à la suite pour afficher le formulaire de correction
    if (membership && membership.status !== 'REJECTED') {

        const status = membership.status as MembershipStatus;
        const info = STATUS_INFO[status] || STATUS_INFO.PENDING;
        const Icon = info.icon;

        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Mon Adhésion {season.name}</h1>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>État du dossier</CardTitle>
                                <CardDescription>Suivi de votre demande pour la saison en cours</CardDescription>
                            </div>
                            <Badge variant="outline" className={`${info.color} gap-1 pr-3`}>
                                <Icon className="w-3 h-3" /> {info.label}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Type d'adhésion</p>
                                <p className="font-medium text-lg">{TYPE_LABELS[membership.type] || membership.type}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date de demande</p>
                                <p className="font-medium">{new Date(membership.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Paiement</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{membership.payment?.amount} €</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {membership.payment?.status === 'PAID' ? 'Payé' : 'En attente'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Message contextuel */}
                        {status === 'VALIDATED' ? (
                            <div className="bg-green-50 p-3 rounded-md text-green-800 text-sm border border-green-100">
                                Votre dossier a été validé.
                            </div>
                        ) : (
                            <div className="bg-yellow-500/10 p-3 rounded-md text-yellow-700 border-yellow-200">
                                Votre dossier est en cours de validation par le tresorier.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Link href="/espace-membre/" className="w-full">
                            <Button variant="outline" className="w-full">Retour au tableau de bord</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Alerte Spéciale Refus */}
            {membership && membership.status === 'REJECTED' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 text-red-800 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="font-semibold">Action requise : Dossier refusé</h3>
                        <p className="text-sm opacity-90">
                            Votre précédente demande n'a pas pu être validée (pièce illisible ou erreur).
                            Veuillez corriger les informations ci-dessous et soumettre à nouveau.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {membership ? "Corriger ma demande" : "Nouvelle Adhésion"}
                </h1>
                <p className="text-muted-foreground">
                    Rejoignez Les Foulées pour la saison <span className="font-semibold text-primary">{season.name}</span>.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Formulaire d'inscription</CardTitle>
                    <CardDescription>Veuillez remplir les informations requises.</CardDescription>
                </CardHeader>
                <CardContent>
                    <MembershipForm 
                    userProfile={user} 
                    season={season} 
                    initialData={membership}/>
                </CardContent>
            </Card>
        </div>
    );
}