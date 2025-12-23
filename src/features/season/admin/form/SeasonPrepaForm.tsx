"use client"

import ErrorBox from "@/components/common/feedback/ErrorBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { CalendarPlus } from "lucide-react";
import { useActionState } from "react";
import { generateNextSeason } from "../../season.actions";
import { NextSeasonResponse } from "../../dal";

interface SeasonPrepaFormProps {
  preview: NextSeasonResponse | null; 
}

export default function SeasonPrepaForm({preview}: SeasonPrepaFormProps) {
    const [state, action, pending] = useActionState(generateNextSeason, undefined);

    return (
        <Card className="border-dashed border-2 border-slate-300">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                    <CalendarPlus className="w-5 h-5" />
                    Préparer la saison prochaine
                </CardTitle>
            </CardHeader>
            <CardContent>
                {preview && preview.success && preview.data ? (
                    <form action={action} className="space-y-4">

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
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Date de fin</Label>
                                    <Input
                                        name="endDate"
                                        type="date"
                                        defaultValue={preview.data.endDate.toISOString().split('T')[0]}
                                        className="bg-white"
                                        readOnly
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
                    <ErrorBox error="Erreur chargement prévisions." />
                )}
            </CardContent>
        </Card>
    );
}