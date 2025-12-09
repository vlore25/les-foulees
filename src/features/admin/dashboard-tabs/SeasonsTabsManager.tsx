"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { SeasonForm } from "../season/components/SeasonForm";

interface SeasonsTabsManagerProps {
  children: ReactNode; // C'est ici qu'on passera <SeasonsList />
}

export default function SeasonsTabsManager({ children }: SeasonsTabsManagerProps) {
  const [view, setView] = useState<"list" | "create">("list");

  // VUE CRÉATION (Formulaire)
  if (view === "create") {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <Button 
            variant="ghost" 
            onClick={() => setView("list")} 
            className="mb-4 gap-2 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        
        {/* On passe une fonction pour revenir à la liste une fois la création finie */}
        <SeasonForm onSuccess={() => setView("list")} /> 
      </div>
    );
  }

  // VUE LISTE (Children + Bouton Ajouter)
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex items-center justify-between">
        <Button onClick={() => setView("create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Préparer nouvelle saison
         </Button> 
      </div>
       {children}
    </div>
  );
}