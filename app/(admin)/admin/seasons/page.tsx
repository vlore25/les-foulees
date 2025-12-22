import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SeasonManager from "@/src/features/season/admin/SeasonManager";
import SeasonList from "@/src/features/season/admin/SeasonList";
import { getSeasonsData } from "@/src/features/season/dal";

export default async function SeasonsPage() {

    const seasonData = await getSeasonsData()
    const { activeSeason, draftSeason } = seasonData

    const tabsContent = [
        {
            name: "Gestionnaire de saison",
            value: 'manager',
            content: (
                <SeasonManager />
            )
        },
        {
            name: 'Historique des saisons',
            value: 'history',
            content: (
                <SeasonList archivedSeasons = {seasonData.archivedSeasons}/>
            )
        },
    ]

    return (
        <div className='w-full space-y-4'>
            <h3 className="text-xl font-bold">Saisons</h3>

            <Tabs defaultValue='manager' className='gap-4'>
                <TabsList className='bg-background'>
                    {/** Onglets */}
                    {tabsContent.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/** Contenu des onglets */}
                {tabsContent.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-4">
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}