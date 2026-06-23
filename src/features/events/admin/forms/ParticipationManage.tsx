"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/Label";
import { X, Plus, Pencil, Check } from "lucide-react";

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
    const [renames, setRenames] = useState<{old: string, new: string}[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

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

    const startEdit = (index: number) => {
        setEditingIndex(index);
        setEditValue(items[index]);
    };

    const saveEdit = (index: number) => {
        const newValue = editValue.trim();
        const oldValue = items[index];
        
        if (newValue && newValue !== oldValue) {
            // Si la nouvelle valeur n'existe pas déjà
            if (!items.includes(newValue)) {
                const newItems = [...items];
                newItems[index] = newValue;
                setItems(newItems);
                
                // Track le rename uniquement si c'est une option qui existait déjà (initialItems)
                // ou on le track de toute façon pour la base de données
                setRenames([...renames, { old: oldValue, new: newValue }]);
            }
        }
        setEditingIndex(null);
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

            <input type="hidden" name={`${name}_renames`} value={JSON.stringify(renames)} />

            {/* Liste des badges avec input hidden pour le FormData */}
            <div className="flex flex-wrap gap-2 min-h-[32px]">
                {items.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Aucune option ajoutée</p>
                )}
                {items.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <input type="hidden" name={name} value={item} />
                        {editingIndex === index ? (
                            <div className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1">
                                <Input 
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="h-6 w-24 text-xs px-2 py-0"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), saveEdit(index))}
                                />
                                <button type="button" onClick={() => saveEdit(index)} className="text-green-600 hover:text-green-700">
                                    <Check size={14} />
                                </button>
                                <button type="button" onClick={() => setEditingIndex(null)} className="text-destructive hover:text-red-700">
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                {item}
                                <button 
                                    type="button" 
                                    onClick={() => startEdit(index)}
                                    className="ml-2 hover:text-primary transition-colors"
                                    title="Modifier"
                                >
                                    <Pencil size={12} />
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => removeItem(index)}
                                    className="ml-1 hover:text-destructive transition-colors"
                                    title="Supprimer"
                                >
                                    <X size={14} />
                                </button>
                            </Badge>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}