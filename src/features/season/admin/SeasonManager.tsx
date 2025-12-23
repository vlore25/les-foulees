import { prisma } from "@/src/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarCheck, CalendarClock, Users, Archive, PlayCircle, Trash2 } from "lucide-react"
import { activateSeasonAction, deleteDraftSeason  } from "../season.actions"
import { getNextSeasonPreview, getSeasonsData } from "../dal"
import SeasonPrepaForm from "./form/SeasonPrepaForm"

export default async function SeasonsManager() {

    const seasonData = await getSeasonsData()
    const { activeSeason, draftSeason } = seasonData
    const preview = !draftSeason ? await getNextSeasonPreview() : null

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* SAISON ACTUELLE */}
                <Card className="border-green-200 bg-green-50/30">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center text-green-800">
                            <span className="flex items-center gap-2"><CalendarCheck className="w-5 h-5" /> Saison Actuelle</span>
                            {activeSeason && <Badge className="bg-green-600">En cours</Badge>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeSeason ? (
                            <div className="space-y-4">
                                <div className="text-2xl font-bold">{activeSeason.name}</div>
                                <div className="text-sm text-gray-600">
                                    Du {activeSeason.startDate.toLocaleString('fr-FR')} au {activeSeason.endDate.toLocaleString('fr-FR')}
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 p-3 rounded-lg w-fit">
                                    <Users className="w-5 h-5" />
                                    <span className="font-bold">{activeSeason._count.memberships}</span> adhérents inscrits
                                </div>
                            </div>
                        ) : (
                            <div className="text-amber-600 flex items-center gap-2">
                                <Archive className="w-4 h-4" /> Aucune saison active.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* BLOC 2 : PROCHAINE SAISON */}
                {draftSeason ? (
                    // CAS A : UNE SAISON EST PRÊTE -> ON L'ACTIVE OU ON LA SUPPRIME (Inchangé)
                    <Card className="border-amber-200 bg-amber-50/30">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-amber-800">
                                <span className="flex items-center gap-2"><CalendarClock className="w-5 h-5" /> Prochaine Saison</span>
                                <div className="flex gap-2">
                                    <form action={async () => {
                                        'use server'
                                        await deleteDraftSeason(draftSeason.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                    <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-100">Prête</Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-2xl font-bold">{draftSeason.name}</div>
                            <div className="text-sm text-gray-600">
                                Prévue du {format(draftSeason.startDate, 'dd/MM/yyyy')} au {format(draftSeason.endDate, 'dd/MM/yyyy')}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-white p-3 rounded border">
                                <div>Standard: <strong>{draftSeason.priceStandard}€</strong></div>
                                <div>Jeune: <strong>{draftSeason.priceYoung}€</strong></div>
                                <div>FFA: <strong>{draftSeason.priceFfa}€</strong></div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <form action={async () => {
                                'use server'
                                await activateSeasonAction(draftSeason.id)
                            }} className="w-full">
                                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                    <PlayCircle className="mr-2 h-4 w-4" /> Lancer cette saison (Activer)
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ) : (
                    <SeasonPrepaForm preview={preview} />
                )}
            </div>
            
        </div>
    )
}