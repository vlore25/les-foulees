"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface EventsTabManagerProps {
  children: ReactNode; 
}

export default function EventsTabManager({ children }: EventsTabManagerProps) {
  const [view, setView] = useState<"list" | "invite">("list");

  if (view === "invite") {
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
        <CreateEvent/> 
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex items-center justify-between w-40">
        <Button onClick={() => setView("invite")} className="gap-2">
            <Plus className="h-4 w-4" />
            Inviter un membre
         </Button> 
      </div>
       {children}
    </div>
  );
}