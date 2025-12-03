"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import InviteMember from "@/src/features/invite/inviteMember";
// import UsersList from "./UsersList"; // Votre liste

interface UsersTabManagerProps {
  children: ReactNode; // C'est ici que passera UsersList
}

export default function UsersTabManager({ children }: UsersTabManagerProps) {
  // État pour savoir quelle vue afficher : 'list' ou 'invite'
  const [view, setView] = useState<"list" | "invite">("list");

  // === VUE 1 : LE FORMULAIRE D'INVITATION ===
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
        
        {/* On affiche votre composant d'invitation */}
        <InviteMember/> 
      </div>
    );
  }

  // === VUE 2 : LA LISTE DES MEMBRES (Par défaut) ===
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="flex items-center justify-between">
         <p className="text-muted-foreground">Voici la liste des membres.</p>
         
         {/* Le bouton qui change l'état vers 'invite' */}
         <Button onClick={() => setView("invite")} className="gap-2">
            <Plus className="h-4 w-4" />
            Inviter un membre
         </Button>
      </div>

      {/* <UsersList /> */}
      <div className="border rounded-md p-4 bg-muted/10 h-64 flex items-center justify-center">
       {children}
      </div>
    </div>
  );
}