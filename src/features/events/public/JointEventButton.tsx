"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { joinEventAction, leaveEventAction } from "@/src/features/events/events.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner"; 

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface JoinButtonProps {
  eventId: string;
  isParticipant: boolean;
  distances?: string[];
  meals?: string[];
  accommodations?: string[];
  userDistance?: string | null;
  userMeals?: string[];
  userAccommodations?: string[];
}

export default function JoinEventButton({ 
  eventId, 
  isParticipant, 
  distances = [], 
  meals = [],
  accommodations = [],
  userDistance = null,
  userMeals = [],
  userAccommodations = []
}: JoinButtonProps) {
  const [isPending, startTransition] = useTransition();
  
  const [selectedDistance, setSelectedDistance] = useState<string | null>(distances.length > 0 ? distances[0] : null);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedAccommodations, setSelectedAccommodations] = useState<string[]>([]);
  const [carpooling, setCarpooling] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour l'inscription 
  const handleJoin = () => {
    startTransition(async () => {
      const result = await joinEventAction(eventId, selectedDistance, selectedMeals, selectedAccommodations, carpooling);
      
      if (!result?.success) {
        toast.error(result?.message || "Une erreur est survenue lors de l'inscription.");
      } else {
        toast.success(result.message || "Inscription validée !");
        setIsOpen(false);
      }
    });
  };

  // Fonction pour la désinscription
  const handleLeave = () => {
    startTransition(async () => {
      const result = await leaveEventAction(eventId);
      
      if (!result?.success) {
        toast.error(result?.message || "Une erreur est survenue lors de la désinscription.");
      } else {
        toast.success(result.message || "Désinscription prise en compte.");
      }
    });
  };

  const toggleMeal = (option: string) => {
    setSelectedMeals(prev => 
      prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
    );
  };

  const toggleAccommodation = (option: string) => {
    setSelectedAccommodations(prev => 
      prev.includes(option) ? prev.filter(p => p !== option) : [...prev, option]
    );
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
        <div className="flex flex-col text-xs text-muted-foreground mt-2">
          {userDistance && <p>Distance : <span className="font-medium">{userDistance}</span></p>}
          {userMeals.length > 0 && <p>Repas : <span className="font-medium">{userMeals.join(", ")}</span></p>}
          {userAccommodations.length > 0 && <p>Hébergement : <span className="font-medium">{userAccommodations.join(", ")}</span></p>}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto font-bold tracking-wider">
          S'inscrire à l'événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black border-b border-primary/10 pb-4">
            Inscription à l'événement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {distances.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground">Distance / Rôle</h4>
              <RadioGroup value={selectedDistance || ""} onValueChange={setSelectedDistance}>
                {distances.map((dist) => (
                  <div key={dist} className="flex items-center space-x-2">
                    <RadioGroupItem value={dist} id={`dist-${dist}`} />
                    <Label htmlFor={`dist-${dist}`}>
                      {dist.toLowerCase()}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {meals.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground">Repas</h4>
              {meals.map((meal) => (
                <div key={meal} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`meal-${meal}`} 
                    checked={selectedMeals.includes(meal)}
                    onCheckedChange={() => toggleMeal(meal)}
                  />
                  <Label htmlFor={`meal-${meal}`}>
                    {meal.toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {accommodations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground">Hébergement</h4>
              {accommodations.map((acc) => (
                <div key={acc} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`acc-${acc}`} 
                    checked={selectedAccommodations.includes(acc)}
                    onCheckedChange={() => toggleAccommodation(acc)}
                  />
                  <Label htmlFor={`acc-${acc}`}>
                    {acc.toLowerCase()}
                  </Label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2 pt-4 border-t border-primary/10">
            <Switch 
              id="carpooling-switch" 
              checked={carpooling}
              onCheckedChange={setCarpooling}
            />
            <Label htmlFor="carpooling-switch">
              Je propose un covoiturage
            </Label>
          </div>
          
          <Button className="w-full mt-4" onClick={handleJoin} disabled={isPending || (distances.length > 0 && !selectedDistance)}>
             {isPending ? "Validation..." : "Valider mon inscription"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}