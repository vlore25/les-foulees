import { prisma } from "@/src/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarCheck, CalendarClock, CalendarPlus, Users, Archive, PlayCircle, Trash2 } from "lucide-react"
import { activateSeasonAction, generateNextSeason, getNextSeasonPreview, deleteDraftSeason } from "../season.actions"
import SeasonList from "./SeasonList"
import { getSeasonsData } from "../dal"
import { Label } from "@radix-ui/react-dropdown-menu"

export default async function SeasonsManager() {

    const seasonData = await getSeasonsData()
    const { activeSeason, draftSeason } = seasonData
    
    // Calcul automatique : Année précédente + 1
    const preview = !draftSeason ? await getNextSeasonPreview() : null

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* BLOC 1 : SAISON ACTUELLE (Inchangé) */}
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
                                    <PlayCircle className="mr-2 h-4 w-4" /> Lancer cette saison (Activer)
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                ) : (
                    // CAS B : FORMULAIRE DE CRÉATION
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
                                    
                                    {/* --- MODIFICATION ICI : NOM AUTOMATIQUE --- */}
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs text-gray-500 uppercase tracking-wider font-bold">Nouvelle Saison</Label>
                                            {/* Affichage visuel du nom calculé */}
                                            <div className="text-2xl font-bold text-slate-800 mt-1">
                                                {preview.data.name}
                                            </div>
                                            {/* Champ caché pour envoyer la donnée au serveur */}
                                            <input type="hidden" name="name" value={preview.data.name} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs text-gray-500">Date de début</Label>
                                                <Input 
                                                    name="startDate" 
                                                    type="date" 
                                                    defaultValue={preview.data.startDate.toISOString().split('T')[0]} 
                                                    className="bg-white" 
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs text-gray-500">Date de fin</Label>
                                                <Input 
                                                    name="endDate" 
                                                    type="date" 
                                                    defaultValue={preview.data.endDate.toISOString().split('T')[0]} 
                                                    className="bg-white" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRIX (Restent éditables) */}
                                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Individuel</Label>
                                            <Input name="priceStandard" type="number" step="0.5" defaultValue={preview.data.prices.priceStandard} className="h-8 bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Couple</Label>
                                            <Input name="priceCouple" type="number" step="0.5" defaultValue={preview.data.prices.priceCouple} className="h-8 bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Jeune</Label>
                                            <Input name="priceYoung" type="number" step="0.5" defaultValue={preview.data.prices.priceYoung} className="h-8 bg-white" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Licence FFA</Label>
                                            <Input name="priceFfa" type="number" step="0.5" defaultValue={preview.data.prices.priceFfa} className="h-8 bg-white" />
                                        </div>
                                    </div>

                                    <Button type="submit" size="sm" className="w-full mt-2">
                                        Enregistrer la saison
                                    </Button>
                                </form>
                            ) : (
                                <p className="text-red-500 text-sm">Erreur chargement prévisions.</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
            <SeasonList archivedSeasons = {seasonData.archivedSeasons}/>
        </div>
    )
}