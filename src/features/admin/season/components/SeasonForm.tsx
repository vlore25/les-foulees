"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateNextSeason, getNextSeasonPreview, type SeasonPrices } from "../season.actions";
import { Loader2, CalendarPlus, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface SeasonFormProps {
    onSuccess: () => void;
}

export const SeasonForm = ({ onSuccess }: SeasonFormProps) => {
    const [isPending, startTransition] = useTransition();
    const [isLoadingPreview, setIsLoadingPreview] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // État pour stocker les infos de la future saison
    const [previewData, setPreviewData] = useState<{ name: string, start: Date, end: Date } | null>(null);
    const [prices, setPrices] = useState<SeasonPrices>({
        priceStandard: 0,
        priceCouple: 0,
        priceYoung: 0,
        priceFfa: 0
    });

    useEffect(() => {
        const load = async () => {
            const result = await getNextSeasonPreview();
            if (result.success && result.data) {
                setPreviewData({
                    name: result.data.name,
                    start: result.data.startDate,
                    end: result.data.endDate
                });
                setPrices(result.data.prices);
            } else {
                setError("Impossible de charger les prévisions.");
            }
            setIsLoadingPreview(false);
        };
        load();
    }, []);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            const result = await generateNextSeason(prices);
            if (result.success) {
                onSuccess(); 
            } else {
                setError(result.message || "Une erreur est survenue");
            }
        });
    };

    // Gestion des inputs numériques
    const handlePriceChange = (key: keyof SeasonPrices, value: string) => {
        const numValue = parseFloat(value);
        setPrices(prev => ({ ...prev, [key]: isNaN(numValue) ? 0 : numValue }));
    };

    if (isLoadingPreview) {
        return (
            <Card className="max-w-lg flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </Card>
        );
    }

    return (
        <Card className="max-w-lg animate-in fade-in zoom-in-95 duration-200">
            <CardHeader>
                <CardTitle>Préparer la saison{previewData?.name}</CardTitle>
                <CardDescription>
                    Vérifiez les tarifs pour la période du <strong>{previewData && format(new Date(previewData.start), 'dd MMMM yyyy', { locale: fr })}</strong> au <strong>{previewData && format(new Date(previewData.end), 'dd MMMM yyyy', { locale: fr })}</strong>.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}
                
                {/* Grille des tarifs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Individuel (€)</label>
                        <Input 
                            type="number" 
                            value={prices.priceStandard} 
                            onChange={(e) => handlePriceChange('priceStandard', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Couple (€)</label>
                        <Input 
                            type="number" 
                            value={prices.priceCouple} 
                            onChange={(e) => handlePriceChange('priceCouple', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Jeune -18 ans (€)</label>
                        <Input 
                            type="number" 
                            value={prices.priceYoung} 
                            onChange={(e) => handlePriceChange('priceYoung', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Licence FFA (€)</label>
                        <Input 
                            type="number" 
                            value={prices.priceFfa} 
                            onChange={(e) => handlePriceChange('priceFfa', e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onSuccess} disabled={isPending}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Création...
                            </>
                        ) : (
                            <>
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Confirmer et Créer
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};