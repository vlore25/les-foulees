import { getActiveSeasonData } from "@/src/features/admin/season/dal";
import { getUserMembershipForActiveSeason } from "@/src/features/membership/dal";
import { MembershipForm } from "@/src/features/membership/components/public/MembershipForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

// Import des Enums générés par Prisma (adaptez le chemin si nécessaire)
import { MembershipStatus, MembershipType } from "@/app/generated/prisma/enums";

// Configuration stricte des statuts en utilisant l'Enum
const STATUS_INFO: Record<MembershipStatus, { label: string; color: string }> = {
    [MembershipStatus.PENDING]: { 
        label: "En attente de validation", 
        color: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-200" 
    },
    [MembershipStatus.VALIDATED]: { 
        label: "Adhésion Validée", 
        color: "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200" 
    },
    [MembershipStatus.REJECTED]: { 
        label: "Dossier Refusé", 
        color: "bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-200" 
    },
};

// Configuration des types d'adhésion
const TYPE_LABELS: Record<MembershipType, string> = {
    [MembershipType.INDIVIDUAL]: "Individuel",
    [MembershipType.COUPLE]: "Couple",
    [MembershipType.YOUNG]: "Jeune (-18)",
    [MembershipType.LICENSE_RUNNING]: "Licence Running (FFA)"
};

export default async function MembershipComp() {
  // 1. Vérification session
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  // 2. Récupération des données
  const season = await getActiveSeasonData();
  const existingMembership = await getUserMembershipForActiveSeason(session.userId);

  // 3. Cas : Pas de saison active
  if (!season) {
    return (
      <div className="container max-w-2xl py-10">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Inscriptions fermées</CardTitle>
            <CardDescription className="text-red-600">
              Aucune saison n'est ouverte aux inscriptions pour le moment.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // 4. Cas : L'utilisateur a déjà une demande
  if (existingMembership) {
    // On utilise l'enum pour récupérer les infos d'affichage (cast sécurisé si besoin)
    const status = existingMembership.status as MembershipStatus;
    const type = existingMembership.type as MembershipType;
    
    const statusInfo = STATUS_INFO[status] || STATUS_INFO[MembershipStatus.PENDING];
    const typeLabel = TYPE_LABELS[type] || type;

    return (
      <div className="container max-w-2xl py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Mon Adhésion {season.name}</h1>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <div>
                    <CardTitle>État du dossier</CardTitle>
                    <CardDescription>Détails de votre demande pour la saison en cours.</CardDescription>
                </div>
                {/* Badge avec styles dynamiques */}
                <Badge variant="outline" className={`${statusInfo.color} whitespace-nowrap`}>
                    {statusInfo.label}
                </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Type d'adhésion</p>
                    <p className="font-semibold text-lg">{typeLabel}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Date de la demande</p>
                    <p>{new Date(existingMembership.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</p>
                </div>
                <div className="space-y-1">
                    <p className="font-medium text-muted-foreground">Paiement</p>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{existingMembership.payment?.amount} €</span>
                        <Badge variant="secondary" className="text-xs">
                            {existingMembership.payment?.status === 'PAID' ? 'Payé' : 'En attente'}
                        </Badge>
                    </div>
                </div>
                {existingMembership.ffaLicenseNumber && (
                    <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">Licence FFA</p>
                        <p className="font-mono bg-slate-100 px-2 py-0.5 rounded w-fit">{existingMembership.ffaLicenseNumber}</p>
                    </div>
                )}
            </div>

            {/* Messages contextuels basés sur l'Enum */}
            {status === MembershipStatus.PENDING && (
                <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-md text-sm">
                    <p className="font-semibold mb-1">Dossier en cours de traitement</p>
                    <p>Votre demande est bien enregistrée. Le trésorier validera votre dossier dès réception du paiement et vérification des pièces.</p>
                </div>
            )}
            
            {status === MembershipStatus.VALIDATED && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-md text-sm">
                    <p className="font-semibold mb-1">Bienvenue au club !</p>
                    <p>Votre adhésion est complète. Vous avez maintenant accès à toutes les fonctionnalités membres.</p>
                </div>
            )}
          </CardContent>
          
          <CardFooter>
             <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">Retour au tableau de bord</Button>
             </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // 5. Cas par défaut : Afficher le formulaire
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle Adhésion</h1>
        <p className="text-muted-foreground">
          Rejoignez Les Foulées pour la saison <span className="font-semibold text-primary">{season.name}</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulaire d'inscription</CardTitle>
          <CardDescription>
            Merci de remplir les informations ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembershipForm />
        </CardContent>
      </Card>
    </div>
  );
}