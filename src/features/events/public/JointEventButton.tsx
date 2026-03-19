"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { joinEventAction, leaveEventAction } from "@/src/features/events/events.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // NOUVEAU: Import du toast

interface JoinButtonProps {
  eventId: string;
  isParticipant: boolean;
  distances?: string[];
  userDistance?: string | null;
}

export default function JoinEventButton({ 
  eventId, 
  isParticipant, 
  distances = [], 
  userDistance 
}: JoinButtonProps) {
  const [isPending, startTransition] = useTransition();

  // Fonction pour l'inscription (avec ou sans distance)
  const handleJoin = (selectedDistance?: string) => {
    startTransition(async () => {
      const result = await joinEventAction(eventId, selectedDistance);
      
      // Affichage du toast en fonction du résultat
      if (!result?.success) {
        toast.error(result?.message || "Une erreur est survenue lors de l'inscription.");
      } else {
        toast.success(result.message || "Inscription validée !");
      }
    });
  };

  // Fonction pour la désinscription
  const handleLeave = () => {
    startTransition(async () => {
      const result = await leaveEventAction(eventId);
      
      // Affichage du toast en fonction du résultat
      if (!result?.success) {
        toast.error(result?.message || "Une erreur est survenue lors de la désinscription.");
      } else {
        toast.success(result.message || "Désinscription prise en compte.");
      }
    });
  };


  if (isParticipant) {
    return (
      <div className="flex flex-col gap-2 items-center lg:items-start">
        <Button 
          className="lg:w-50 w-full"
          onClick={handleLeave} 
          disabled={isPending}
          variant="outlinerounded"
        >
          {isPending ? "Chargement..." : "Se désinscrire"}
        </Button>
        {userDistance && (
          <p className="text-xs text-muted-foreground">
            Inscrit sur : <span className="font-medium">{userDistance}</span>
          </p>
        )}
      </div>
    );
  }

  // CAS 2 : L'événement a des DISTANCES -> Menu déroulant
  if (distances && distances.length > 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="lg:w-50 w-full" disabled={isPending} variant="rounded">
            {isPending ? "Chargement..." : "Je participe !"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-50">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            Choisissez une distance
          </div>
          {distances.map((dist) => (
            <DropdownMenuItem 
              key={dist} 
              onClick={() => handleJoin(dist)}
              className="cursor-pointer"
            >
              S'inscrire au {dist}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // CAS 3 : L'événement n'a PAS de distance -> Bouton simple
  return (
    <Button 
      className="lg:w-50 w-full"
      onClick={() => handleJoin()} 
      disabled={isPending}
      variant="rounded"
    >
      {isPending ? "Chargement..." : "Je participe !"}
    </Button>
  );
}