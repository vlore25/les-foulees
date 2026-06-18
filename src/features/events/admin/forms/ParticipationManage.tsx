"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/Label";
import { X, Plus } from "lucide-react";

export default function DynamicListManager({ 
    initialItems = [], 
    name, 
    label, 
    placeholder 
}: { 
    initialItems?: string[], 
    name: string, 
    label: string, 
    placeholder: string 
}) {
    const [items, setItems] = useState<string[]>(initialItems);
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        const value = inputValue.trim();
        if (value && !items.includes(value)) {
            setItems([...items, value]);
            setInputValue(""); // On vide l'input après l'ajout
        }
    };

    const removeItem = (indexToRemove: number) => {
        setItems(items.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
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
                {items.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Aucune option ajoutée</p>
                )}
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <input type="hidden" name={name} value={item} />
                        <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {item}
                            <button 
                                type="button" 
                                onClick={() => removeItem(index)}
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