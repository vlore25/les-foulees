import { prisma } from "@/src/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarCheck, CalendarClock, CalendarPlus, Users, Archive, PlayCircle } from "lucide-react"
import { activateSeasonAction, generateNextSeason, getNextSeasonPreview } from "../season.actions"
import { Label } from "@radix-ui/react-dropdown-menu"
import SeasonList from "./SeasonList"
import { getSeasonsData } from "../dal"

export default async function SeasonsManager() {

    const seasonData = await getSeasonsData()

    const { activeSeason, draftSeason } = seasonData

    const preview = !draftSeason ? await getNextSeasonPreview() : null

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

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
                                    Du {format(activeSeason.startDate, 'd MMMM yyyy', { locale: fr })} au {format(activeSeason.endDate, 'd MMMM yyyy', { locale: fr })}
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 p-3 rounded-lg w-fit">
                                    <Users className="w-5 h-5" />
                                    <span className="font-bold">{activeSeason._count.memberships}</span> adhérents inscrits
                                </div>
                            </div>
                        ) : (
                            <div className="text-amber-600 flex items-center gap-2">
                                <Archive className="w-4 h-4" /> Aucune saison active pour le moment.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* BLOC 2 : GESTION DE LA FUTURE SAISON (Workflow) */}
                {draftSeason ? (
                    // CAS A : UN BROUILLON EXISTE DÉJÀ -> ON PROPOSE DE L'ACTIVER
                    <Card className="border-amber-200 bg-amber-50/30">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-amber-800">
                                <span className="flex items-center gap-2"><CalendarClock className="w-5 h-5" /> Prochaine Saison</span>
                                <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-100">Brouillon</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-2xl font-bold">{draftSeason.name}</div>
                            <div className="text-sm text-gray-600">
                                Prête à démarrer le {format(draftSeason.startDate, 'd MMMM yyyy', { locale: fr })}.
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm bg-white p-3 rounded border">
                                <div>Standard: <strong>{draftSeason.priceStandard}€</strong></div>
                                <div>Couple: <strong>{draftSeason.priceCouple}€</strong></div>
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
                                    <PlayCircle className="mr-2 h-4 w-4" /> Ouvrir les inscriptions (Activer)
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ) : (
                    // CAS B : PAS DE BROUILLON -> FORMULAIRE DE CRÉATION
                    <Card className="border-dashed border-2 border-slate-300">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                                <CalendarPlus className="w-5 h-5" />
                                Préparer la saison prochaine
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {preview && preview.success && preview.data ? (
                                <form action={generateNextSeason} className="space-y-4">
                                    <input type="hidden" name="name" value={preview.data.name} />
                                    <input type="hidden" name="startDate" value={preview.data.startDate.toISOString()} />
                                    <input type="hidden" name="endDate" value={preview.data.endDate.toISOString()} />

                                    <div className="text-sm text-muted-foreground mb-2">
                                        Génération de la saison : <strong>{preview.data.name}</strong>
                                    </div>

                                    {/* GRILLE DES PRIX */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Individuel</Label>
                                            <div className="relative">
                                                <Input id="priceStandard" name="priceStandard" type="number" step="0.5" defaultValue={preview.data.prices.priceStandard} className="h-8 pl-6 bg-white" />
                                                <span className="absolute left-2 top-1.5 text-xs text-gray-500">€</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Couple</Label>
                                            <div className="relative">
                                                <Input id="priceCouple" name="priceCouple" type="number" step="0.5" defaultValue={preview.data.prices.priceCouple} className="h-8 pl-6 bg-white" />
                                                <span className="absolute left-2 top-1.5 text-xs text-gray-500">€</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Jeune</Label>
                                            <div className="relative">
                                                <Input id="priceYoung" name="priceYoung" type="number" step="0.5" defaultValue={preview.data.prices.priceYoung} className="h-8 pl-6 bg-white" />
                                                <span className="absolute left-2 top-1.5 text-xs text-gray-500">€</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Licence FFA</Label>
                                            <div className="relative">
                                                <Input id="priceFfa" name="priceFfa" type="number" step="0.5" defaultValue={preview.data.prices.priceFfa} className="h-8 pl-6 bg-white" />
                                                <span className="absolute left-2 top-1.5 text-xs text-gray-500">€</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" size="sm" className="w-full mt-2">
                                        Créer le brouillon
                                    </Button>
                                </form>
                            ) : (
                                <p className="text-red-500 text-sm">Impossible de calculer les dates automatiquement.</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
            <SeasonList archivedSeasons = {seasonData.archivedSeasons}/>


        </div>
    )
}