import { prisma } from "@/src/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale" // Pour les dates en français
import { CalendarPlus } from "lucide-react"
import { generateNextSeason, getNextSeasonPreview } from "../season.actions"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-dropdown-menu"
 // Assure-toi que le chemin est bon

export default async function SeasonsManager() {
  
  // 1. RÉCUPÉRATION DES DONNÉES (Server Side)
  // On inclut le _count pour savoir combien d'adhérents sont liés
  const seasons = await prisma.season.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      _count: {
        select: { memberships: true }
      }
    }
  })

  // 2. PRÉVISION POUR LA PROCHAINE SAISON
  const preview = await getNextSeasonPreview()

  return (
    <div className="space-y-8">

      <Card className="bg-slate-50 border-dashed border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-primary" />
            Préparer la saison prochaine
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            {preview.success && preview.data ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Saison cible : <strong>{preview.data.name}</strong></p>
                <p>
                  Du {format(preview.data.startDate, 'dd MMMM yyyy', { locale: fr })} au {format(preview.data.endDate, 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-xs italic">Les tarifs seront copiés de la dernière saison.</p>
              </div>
            ) : (
               <p className="text-red-500 text-sm">Impossible de calculer les dates.</p>
            )}
          </div>

          <form action={async () => {
            'use server'
            if (preview.data) await generateNextSeason(preview.data.prices)
          }}>
             <Button disabled={!preview.success}>
               Générer le brouillon
             </Button>
          </form>
        </CardContent>
      </Card>


      {/* --- PARTIE 2 : TA LISTE (Avec ton design) --- */}
      <Card className="bg-slate-50 border-dashed border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarPlus className="w-5 h-5 text-primary" />
            Préparer la saison prochaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          {preview.success && preview.data ? (
            <form action={generateNextSeason} className="space-y-4">
                <input type="hidden" name="name" value={preview.data.name} />
                <input type="hidden" name="startDate" value={preview.data.startDate.toISOString()} />
                <input type="hidden" name="endDate" value={preview.data.endDate.toISOString()} />

                <div className="text-sm text-muted-foreground mb-4">
                    Saison cible : <strong>{preview.data.name}</strong> <br/>
                    Du {format(preview.data.startDate, 'dd MMMM yyyy', { locale: fr })} au {format(preview.data.endDate, 'dd MMMM yyyy', { locale: fr })}
                </div>

                {/* GRILLE DES PRIX ÉDITABLES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label >Individuel</Label>
                        <div className="relative">
                            <Input
                                id="priceStandard" 
                                name="priceStandard" 
                                type="number" 
                                step="0.5"
                                defaultValue={preview.data.prices.priceStandard} 
                                className="pl-8 bg-white"
                            />
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500">€</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Couple</Label>
                        <div className="relative">
                            <Input 
                                id="priceCouple" 
                                name="priceCouple" 
                                type="number" 
                                step="0.5"
                                defaultValue={preview.data.prices.priceCouple} 
                                className="pl-8 bg-white"
                            />
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500">€</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Jeune (-18)</Label>
                        <div className="relative">
                            <Input 
                                id="priceYoung" 
                                name="priceYoung" 
                                type="number" 
                                step="0.5"
                                defaultValue={preview.data.prices.priceYoung} 
                                className="pl-8 bg-white"
                            />
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500">€</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Licence FFA</Label>
                        <div className="relative">
                            <Input 
                                id="priceFfa" 
                                name="priceFfa" 
                                type="number" 
                                step="0.5"
                                defaultValue={preview.data.prices.priceFfa} 
                                className="pl-8 bg-white"
                            />
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500">€</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit">
                        Générer le brouillon
                    </Button>
                </div>
            </form>
          ) : (
             <p className="text-red-500 text-sm">Impossible de calculer les dates.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}