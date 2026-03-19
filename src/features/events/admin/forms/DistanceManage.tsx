"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export default function DistanceManager({ initialDistances = [] }: { initialDistances?: string[] }) {
    const [distances, setDistances] = useState<string[]>(initialDistances);
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        const value = inputValue.trim();
        if (value && !distances.includes(value)) {
            setDistances([...distances, value]);
            setInputValue(""); // On vide l'input après l'ajout
        }
    };

    const removeDistance = (indexToRemove: number) => {
        setDistances(distances.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
            <label className="block text-sm font-medium">Distances de l'événement</label>
            
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ex: 10km, 21km..."
                        className="bg-background pr-20"
                    />
                    {/* On affiche le bouton "Ajouter" uniquement si l'admin écrit */}
                    {inputValue.trim() !== "" && (
                        <Button 
                            type="button"
                            size="sm"
                            onClick={handleAdd}
                            className="absolute right-1 top-1 h-8 px-2 flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Ajouter {inputValue}
                        </Button>
                    )}
                </div>
            </div>

            {/* Liste des badges avec input hidden pour le FormData */}
            <div className="flex flex-wrap gap-2 min-h-[32px]">
                {distances.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Aucune distance ajoutée</p>
                )}
                {distances.map((dist, index) => (
                    <div key={index} className="flex items-center">
                        <input type="hidden" name="distances" value={dist} />
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {dist}
                            <button 
                                type="button" 
                                onClick={() => removeDistance(index)}
                                className="ml-1 hover:text-destructive transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}