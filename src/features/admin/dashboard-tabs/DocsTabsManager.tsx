"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import LegalDocForm from "../../docs/components/admin/LegalDocsForm";

interface LegalsDocsTabManagerProps {
  children: ReactNode; 
}

export default function LegalDocsTabManager({ children }: LegalsDocsTabManagerProps) {
  const [view, setView] = useState<"list" | "create">("list");

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
        <LegalDocForm /> 
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex items-center justify-between">
        <Button onClick={() => setView("create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un document
         </Button> 
      </div>
       {children}
    </div>
  );
}