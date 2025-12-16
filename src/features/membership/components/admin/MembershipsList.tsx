import { Badge } from "@/components/ui/badge";
import getAdhesions, { getAdhesionStats } from "../../dal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MembershipTable from "./MembershipTable";
import { prisma } from "@/src/lib/prisma";
import ExportButton from "./ExportButton";
import SeasonFilter from "./SeasonFilter";

// On définit les props pour récupérer les paramètres d'URL (Next.js 13+ Server Components)
export default async function MembershipsList({
    searchParams
}: {
    searchParams: Promise<{ seasonId?: string }> // Note: En Next.js 15, searchParams est une Promise. En 14, c'est un objet direct. J'utilise la syntaxe compatible/safe.
}) {
    
    // 1. Récupération des paramètres (gestion asynchrone pour compatibilité future)
    const params = await searchParams;
    const urlSeasonId = params?.seasonId;

    // 2. Récupérer toutes les saisons pour le Select
    const allSeasons = await prisma.season.findMany({
        orderBy: { startDate: 'desc' },
        select: { id: true, name: true, isActive: true }
    });

    // 3. Identifier la saison active ou celle sélectionnée
    const activeSeason = allSeasons.find(s => s.isActive);
    // Si aucune saison dans l'URL, on prend la saison active par défaut
    const selectedSeasonId = urlSeasonId || activeSeason?.id;

    // 4. Récupérer les données filtrées avec le nouvel argument seasonId
    // Note: Assurez-vous d'avoir bien mis à jour votre dal.tsx pour accepter ce 2ème argument
    const [stats, allMembers, toHandleMembers, validatedMembers] = await Promise.all([
        getAdhesionStats(), // Note: Idéalement, getAdhesionStats devrait aussi accepter selectedSeasonId pour être cohérent
        getAdhesions('ALL', selectedSeasonId),
        getAdhesions('TO_HANDLE', selectedSeasonId),
        getAdhesions('VALIDATED', selectedSeasonId)
    ]);

    // 5. Configuration des onglets
    const tabConfig = [
        { 
            key: 'TO_HANDLE', 
            label: 'À vérifier', 
            count: toHandleMembers.length, // On compte directement la liste filtrée
            data: toHandleMembers, 
            variant: "destructive" // Rouge
        },
        { 
            key: 'VALIDATED', 
            label: 'Dossiers Validés', 
            count: validatedMembers.length, 
            data: validatedMembers, 
            variant: "default" // Noir/Standard
        },
        { 
            key: 'ALL', 
            label: 'Tous les dossiers', 
            count: allMembers.length, 
            data: allMembers, 
            variant: "outline" 
        },
    ];

    return (
        <div className="space-y-4">
            
            {/* BARRE D'OUTILS : Filtre Saison + Export CSV */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Saison :</span>
                    {/* Le composant client qui gère le changement d'URL */}
                    <SeasonFilter
                        seasons={allSeasons} 
                        currentSeasonId={selectedSeasonId} 
                    />
                </div>
                
                {/* Le bouton exporte TOUJOURS "allMembers" de la saison sélectionnée */}
                <ExportButton data={allMembers} filename={`adherents_saison_${selectedSeasonId}`} />
            </div>

            {/* VOS ONGLETS (Tabs) */}
            <Tabs defaultValue="TO_HANDLE" className="gap-4">
                
                <TabsList className="h-auto p-2 bg-muted/50 flex flex-wrap gap-2 justify-start w-full sm:w-auto">
                    {tabConfig.map((tab) => (
                        <TabsTrigger key={tab.key} value={tab.key} className="flex gap-2">
                            {tab.label}
                            <Badge variant={tab.variant as any} className="ml-1 px-1.5 py-0.5 h-5 min-w-[1.25rem]">
                                {tab.count}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabConfig.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key} className="mt-4">
                        <MembershipTable memberships={tab.data} />
                    </TabsContent>
                ))}

            </Tabs>
        </div>
    );
}