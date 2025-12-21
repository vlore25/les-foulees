import { Badge } from "@/components/ui/badge";
import getAdhesions from "../../dal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MembershipTable from "./MembershipTable";
import { prisma } from "@/src/lib/prisma";
import SeasonFilter from "./SeasonFilter";
import ExportButton from "./ExportButton";

export default async function MembershipsList({
    searchParams
}: {
    searchParams: Promise<{ seasonId?: string }>
}) {
    
    const params = await searchParams;
    const urlSeasonId = params?.seasonId;

    // 2. Charger les saisons
    const allSeasons = await prisma.season.findMany({
        orderBy: { startDate: 'desc' },
        select: { id: true, name: true, isActive: true }
    });

    const activeSeason = allSeasons.find(s => s.isActive);
    
    // 3. Déterminer l'ID cible
    const targetSeasonId = urlSeasonId || activeSeason?.id || allSeasons[0]?.id;

    if (!targetSeasonId) return <div>Aucune saison trouvée.</div>;

    const currentSeason = allSeasons.find(s => s.id === targetSeasonId);

    // 4. Charger les données
    const [allMembers, toHandleMembers, validatedMembers] = await Promise.all([
        getAdhesions('ALL', targetSeasonId),
        getAdhesions('TO_HANDLE', targetSeasonId),
        getAdhesions('VALIDATED', targetSeasonId)
    ]);

    // 5. Configurer les onglets
    const tabConfig = [
        { 
            key: 'TO_HANDLE', 
            label: 'À vérifier', 
            count: toHandleMembers.length, 
            data: toHandleMembers, 
            variant: "destructive" 
        },
        { 
            key: 'VALIDATED', 
            label: 'Dossiers Validés', 
            count: validatedMembers.length, 
            data: validatedMembers, 
            variant: "default" 
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
            
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                        Saison :
                    </span>
                    <SeasonFilter 
                        seasons={allSeasons} 
                        currentSeasonId={targetSeasonId} 
                    />
                </div>
                
                <ExportButton 
                    data={allMembers} 
                    filename={`adherents_${currentSeason?.name || 'export'}`} 
                />
            </div>

            {/* Titre dynamique pour confirmation visuelle */}
            <h3 className="text-lg font-semibold text-slate-800">
                Liste pour la saison : <span className="text-primary">{currentSeason?.name}</span>
            </h3>

            {/* --- LA CORRECTION EST ICI --- 
               Ajouter key={targetSeasonId} force React à détruire et recréer 
               toute la zone des onglets quand la saison change.
               Cela garantit que les tableaux affichent les nouvelles données.
            */}
            <Tabs defaultValue="TO_HANDLE" className="gap-4" key={targetSeasonId}>
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
                        {tab.data.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground border rounded-md border-dashed bg-slate-50">
                                Aucun dossier dans "{tab.label}" pour la saison {currentSeason?.name}.
                            </div>
                        ) : (
                            <MembershipTable memberships={tab.data} />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}