'use client'

import { useState, useTransition } from "react" // <-- NOUVEAU : pour gérer l'état
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { validateMembershipAction, refuseMembershipAction } from "../memberships.actions";

interface MembershipRowActionsProps {
    id: string;
    status: string;
}

export default function MembershipRowActions({ id, status }: MembershipRowActionsProps) {
    // État pour ouvrir/fermer la fenêtre de confirmation
    const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false); // <-- NOUVEAU
    const [isPending, startTransition] = useTransition(); // <-- NOUVEAU : Pour l'état de chargement
    const canValidate = status !== 'VALIDATED' && status !== 'REJECTED';

    const handleValidate = async () => {
        // On utilise startTransition pour éviter de bloquer l'UI
        startTransition(async () => {
            const result = await validateMembershipAction(id);
            if (result.success) {
                console.log("Dossier validé");
            } else {
                console.error("Erreur validation");
            }
        });
    };


    const handleRefuse = async () => {
        startTransition(async () => {
            const result = await refuseMembershipAction(id);
            if (result.success) {
                console.log("Dossier refusé");
                setIsRefuseDialogOpen(false); // On ferme la fenêtre
            } else {
                console.error("Erreur refus");
            }
        });
    };

    return (
        <> {/* <-- On ajoute des fragments <> car on a maintenant 2 éléments (Menu + Dialog) */}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    {canValidate && (
                        <DropdownMenuItem onClick={handleValidate} className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Valider le dossier
                        </DropdownMenuItem>
                    )}

                    {/* Le bouton Refuser reste disponible tant que ce n'est pas déjà refusé */}
                    {status !== 'REJECTED' && status !== 'VALIDATED' && (
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setIsRefuseDialogOpen(true);
                            }}
                            className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Refuser le dossier
                        </DropdownMenuItem>
                    )}

                    {/* Si le dossier est REFUSÉ, on peut afficher un texte informatif (optionnel) */}
                    {status === 'REJECTED' && (
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed italic">
                            En attente de correction utilisateur...
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* --- NOUVEAU : LA FENÊTRE DE CONFIRMATION --- */}
            <AlertDialog open={isRefuseDialogOpen} onOpenChange={setIsRefuseDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Refuser ce dossier ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le statut passera à <strong>REFUSÉ</strong>.<br />
                            L'adhérent devra corriger ses informations et soumettre à nouveau le formulaire.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleRefuse();
                            }}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isPending ? "Traitement..." : "Confirmer le refus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
}