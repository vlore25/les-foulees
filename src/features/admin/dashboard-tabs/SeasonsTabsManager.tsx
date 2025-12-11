"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

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
        

      </div>
    );
  }

  // VUE LISTE (Children + Bouton Ajouter)
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
       {children}
    </div>
  );
}