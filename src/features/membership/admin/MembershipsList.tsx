import { Badge } from "@/components/ui/badge";
import getAdhesions from "../dal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MembershipSimpleList from "./MembershipSimpleList";
import { prisma } from "@/src/lib/prisma";
import SeasonFilter from "./SeasonFilter";
import ExportButton from "./ExportButton";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import { Calendar } from "lucide-react";

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

    if (!targetSeasonId) return <EmptyCategory text="Aucune saison trouvée." emptyIcon={Calendar}/>

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
        <div className="space-y-6">
            
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-md shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
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

            <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-800">
                    Gestion des adhésions
                </h3>
                <p className="text-xs font-bold text-primary uppercase tracking-widest italic">
                    Saison {currentSeason?.name}
                </p>
            </div>

            <Tabs defaultValue="TO_HANDLE" className="gap-6" key={targetSeasonId}>
                <TabsList className="h-auto p-1 bg-slate-100/50 rounded-md border border-slate-200 flex flex-wrap gap-1 justify-start w-full sm:w-auto">
                    {tabConfig.map((tab) => (
                        <TabsTrigger key={tab.key} value={tab.key} className="flex gap-2 rounded-sm px-3 py-2 font-bold uppercase text-xs tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            {tab.label}
                            <Badge variant={tab.variant as any} className="ml-1 px-1.5 py-0 h-5 min-w-[1.5rem] text-xs border-none rounded-sm flex items-center justify-center font-black">
                                {tab.count}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabConfig.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key} className="mt-4 animate-in fade-in duration-300">
                        {tab.data.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 border border-dashed rounded-md bg-slate-50 font-bold italic uppercase tracking-widest text-xs">
                                Aucun dossier dans "{tab.label}"
                            </div>
                        ) : (
                            <MembershipSimpleList memberships={tab.data} />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}