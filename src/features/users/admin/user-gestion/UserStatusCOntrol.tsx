// components/admin/UserStatusControl.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Trash2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { statusUserAction, anonymizeUserAction } from "../../user.action";

interface UserStatusControlProps {
  userId: string;
  isActive: string;
}

export function UserStatusControl({ userId, isActive }: UserStatusControlProps) {
  const [loading, setLoading] = useState(false);
  const [loadingAnon, setLoadingAnon] = useState(false);

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await statusUserAction(userId);
      toast.success(isActive === "ACTIVE" ? "Compte désactivé avec succès" : "Compte réactivé");
    } catch (error) {
      toast.error("Erreur lors de la modification du statut");
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymize = async () => {
    setLoadingAnon(true);
    try {
      await anonymizeUserAction(userId);
      toast.success("Le compte a été définitivement anonymisé.");
    } catch (error) {
      toast.error("Erreur lors de l'anonymisation du compte");
    } finally {
      setLoadingAnon(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20 w-100% lg:w-100">
      <div>
        <h3 className="text-sm font-medium">Statut du compte</h3>
        <p className="text-sm text-muted-foreground">
          {isActive === "ACTIVE"
            ? "Le compte est actuellement actif et peut accéder au site." 
            : "Le compte est désactivé. L'accès est bloqué."}
        </p>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant={isActive === "ACTIVE" ? "destructive" : "default"} 
            className="ml-auto"
            disabled={loading}
          >
            {isActive === "ACTIVE" ? (
              <><Trash2 className="mr-2 h-4 w-4" /> Désactiver</>
            ) : (
              <><ShieldCheck className="mr-2 h-4 w-4" /> Réactiver</>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer l'action</AlertDialogTitle>
            <AlertDialogDescription>
              {isActive 
                ? "Voulez-vous vraiment désactiver ce compte ? L'utilisateur ne pourra plus se connecter."
                : "Voulez-vous réactiver ce compte ?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus}
              className={isActive ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Continuer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bouton d'anonymisation RGPD (Droit à l'oubli) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            disabled={loadingAnon}
          >
            Anonymiser (RGPD)
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suppression définitive (Anonymisation)</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les données personnelles de l'utilisateur (nom, email, téléphone, adresse) seront définitivement remplacées par "Ancien Utilisateur". L'historique des paiements sera conservé pour la comptabilité.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAnonymize}
              className="bg-red-600 hover:bg-red-700"
            >
              Anonymiser définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}