import { prisma } from "@/src/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarCheck, CalendarClock, Users, Archive, PlayCircle, Trash2 } from "lucide-react"
import { activateSeasonAction, deleteDraftSeason } from "../season.actions"
import { getNextSeasonPreview, getSeasonsData } from "../dal"
import SeasonPrepaForm from "./form/SeasonPrepaForm"

export default async function SeasonsManager() {

    const seasonData = await getSeasonsData()
    const { activeSeason, draftSeason } = seasonData
    const preview = !draftSeason ? await getNextSeasonPreview() : null

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card className="border-slate-200 bg-white rounded-xl shadow-sm py-4">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex justify-between items-center text-slate-900 font-bold">
                            <span className="flex items-center gap-2 text-slate-700 text-base">
                                <CalendarCheck className="w-5 h-5 text-primary" /> Saison Actuelle
                            </span>
                            {activeSeason && (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2 py-0.5 hover:bg-emerald-50">
                                    En cours
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeSeason ? (
                            <div className="space-y-4">
                                <div className="text-2xl font-black text-slate-950">{activeSeason.name}</div>
                                <div className="text-sm text-slate-500">
                                    Du {activeSeason.startDate.toLocaleString('fr-FR', dateOptions)} au {activeSeason.endDate.toLocaleString('fr-FR', dateOptions)}
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 p-3 rounded-lg w-fit text-sm">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="font-bold text-slate-900">{activeSeason._count.memberships}</span> adhérents inscrits
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-500 flex items-center gap-2 text-sm italic">
                                <Archive className="w-4 h-4 text-slate-400" /> Aucune saison active actuellement.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* BLOC 2 : PROCHAINE SAISON */}
                {draftSeason ? (
                    <Card className="border-slate-200 bg-white rounded-xl shadow-sm py-4">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center text-slate-900 font-bold">
                                <span className="flex items-center gap-2 text-slate-700 text-base">
                                    <CalendarClock className="w-5 h-5 text-primary" /> Prochaine Saison
                                </span>
                                <div className="flex items-center gap-2">
                                    <form action={async () => {
                                        'use server'
                                        await deleteDraftSeason(draftSeason.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-md">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 font-bold px-2 py-0.5">
                                        Prête
                                    </Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-2xl font-black text-slate-950">{draftSeason.name}</div>
                            <div className="text-sm text-slate-500">
                                Prévue du {format(draftSeason.startDate, 'dd/MM/yyyy')} au {format(draftSeason.endDate, 'dd/MM/yyyy')}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 border border-slate-100 p-3 rounded-lg">
                                <div className="flex flex-col"><span className="text-slate-400 font-medium">Standard</span><span className="font-bold text-slate-800 text-sm">{draftSeason.priceStandard} €</span></div>
                                <div className="flex flex-col"><span className="text-slate-400 font-medium">Jeune</span><span className="font-bold text-slate-800 text-sm">{draftSeason.priceYoung} €</span></div>
                                <div className="flex flex-col"><span className="text-slate-400 font-medium">Licencié FFA</span><span className="font-bold text-slate-800 text-sm">{draftSeason.priceFfa} €</span></div>
                            </div>
                            <form action={async () => {
                                'use server'
                                await activateSeasonAction(draftSeason.id)
                            }} className="w-full">
                                <Button className="w-full bg-primary hover:bg-primary/95 text-white py-5 rounded-lg font-bold transition-all hover:scale-[1.01] active:scale-[0.99]">
                                    <PlayCircle className="mr-2 h-4 w-4" /> Activer et Lancer la saison
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <SeasonPrepaForm preview={preview} />
                )}
            </div>

        </div>
    )
}