"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { joinEventAction, leaveEventAction,} from "@/src/features/events/events.actions";

interface JoinButtonProps {
  eventId: string;
  isParticipant: boolean;
}

export default function JoinEventButton({ eventId, isParticipant }: JoinButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleParticipation = () => {
    startTransition(async () => {
      let result;
      
      if (isParticipant) {
        result = await leaveEventAction(eventId);
      } else {
        result = await joinEventAction(eventId);
      }

      if (!result.success) {
        // Gérer l'erreur (ex: alert(result.message))
        console.error(result.message);
      }
    });
  };

  return (
    <Button 
      onClick={handleToggleParticipation} 
      disabled={isPending}
      variant={isParticipant ? "outline" : "default"}
    >
      {isPending 
        ? "Chargement..." 
        : (isParticipant ? "Se désinscrire" : "Je participe !")
      }
    </Button>
  );
}