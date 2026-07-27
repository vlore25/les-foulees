"use client"

import ErrorBox from "@/components/common/feedback/ErrorBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { CalendarPlus } from "lucide-react";
import { useActionState, useRef } from "react";
import { generateNextSeason } from "../../season.actions";
import { NextSeasonResponse } from "../../dal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SeasonPrepaFormProps {
  preview: NextSeasonResponse | null; 
}

export default function SeasonPrepaForm({preview}: SeasonPrepaFormProps) {
    const [state, action, pending] = useActionState(generateNextSeason, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    const startDateObj = preview?.data?.startDate ? (typeof preview.data.startDate === 'string' ? new Date(preview.data.startDate) : preview.data.startDate) : null;
    const endDateObj = preview?.data?.endDate ? (typeof preview.data.endDate === 'string' ? new Date(preview.data.endDate) : preview.data.endDate) : null;

    const startDateObj = preview?.data?.startDate ? (typeof preview.data.startDate === 'string' ? new Date(preview.data.startDate) : preview.data.startDate) : null;
    const endDateObj = preview?.data?.endDate ? (typeof preview.data.endDate === 'string' ? new Date(preview.data.endDate) : preview.data.endDate) : null;

    return (
        <Card className="border-dashed border-2 border-slate-300 rounded-none py-4">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-700">
                    <CalendarPlus className="w-5 h-5" />
                    Préparer la saison prochaine
                </CardTitle>
            </CardHeader>
            <CardContent>
                {preview && preview.success && preview.data ? (
                    <form ref={formRef} action={action} className="space-y-4">

                        {/* --- MODIFICATION ICI : NOM AUTOMATIQUE --- */}
                        <div className="space-y-3">
                            <div>
                                <Label>Nouvelle Saison</Label>
                                {/* Affichage visuel du nom calculé */}
                                <div className="text-2xl font-bold text-slate-800 mt-1">
                                    {preview.data.name}
                                </div>
                                {/* Champ caché pour envoyer la donnée au serveur */}
                                <input type="hidden" name="name" value={preview.data.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Date de début</Label>
                                    <div className="border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-700 rounded-md text-sm font-semibold mt-1">
                                        {startDateObj ? startDateObj.toLocaleDateString("fr-FR") : ""}
                                    </div>
                                    {startDateObj && (
                                        <input type="hidden" name="startDate" value={startDateObj.toISOString().split('T')[0]} />
                                    )}
                                </div>
                                <div>
                                    <Label>Date de fin</Label>
                                    <div className="border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-700 rounded-md text-sm font-semibold mt-1">
                                        {endDateObj ? endDateObj.toLocaleDateString("fr-FR") : ""}
                                    </div>
                                    {endDateObj && (
                                        <input type="hidden" name="endDate" value={endDateObj.toISOString().split('T')[0]} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PRIX (Restent éditables) */}
                        <div className="border-t">
                            <p>Prix d'adhesion</p>
                            <div className="grid grid-cols-2 gap-3 pt-2 ">
                            
                            <div className="space-y-1">
                                <Label>Individuel</Label>
                                <Input name="priceStandard" type="number" step="0.5" defaultValue={preview.data.prices.priceStandard} className="h-8 bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label>Jeune</Label>
                                <Input name="priceYoung" type="number" step="0.5" defaultValue={preview.data.prices.priceYoung} className="h-8 bg-white" />
                            </div>
                            <div className="space-y-1">
                                <Label>Licence FFA</Label>
                                <Input name="priceFfa" type="number" step="0.5" defaultValue={preview.data.prices.priceFfa} className="h-8 bg-white" />
                            </div>
                        </div>
                        </div>
                        
                        

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type="button" size="sm" className="w-full mt-2" disabled={pending}>
                                    Enregistrer la saison
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la création de la saison ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Vous êtes sur le point de créer la saison <strong>{preview.data.name}</strong>.<br />
                                        Les dates de début et de fin seront bloquées et ne pourront plus être modifiées après création.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => formRef.current?.requestSubmit()}
                                        className="bg-primary text-primary-foreground hover:bg-primary/95"
                                    >
                                        Confirmer la création
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </form>
                ) : (
                    <ErrorBox error="Erreur chargement prévisions." />
                )}
            </CardContent>
        </Card>
    );
}