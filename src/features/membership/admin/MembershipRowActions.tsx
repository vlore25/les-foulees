'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
import { MoreHorizontal, CheckCircle, XCircle, Loader2, Banknote } from "lucide-react";
import { validateMembershipAction, refuseMembershipAction } from "../memberships.actions";

interface MembershipRowActionsProps {
    id: string;
    status: string;
    paymentStatus?: string; // <-- 1. On ajoute le statut du paiement ici
}

export default function MembershipRowActions({ id, status, paymentStatus }: MembershipRowActionsProps) {
    const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isPaid = paymentStatus === 'PAID';

    const canValidate = status !== 'VALIDATED' && status !== 'REJECTED' && isPaid;

    const handleValidate = async () => {
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
                setIsRefuseDialogOpen(false);
            }
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    {/* Action de validation (seulement si payé) */}
                    {canValidate && (
                        <DropdownMenuItem onClick={handleValidate} className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Valider le dossier
                        </DropdownMenuItem>
                    )}

                    {/* Feedback visuel si le dossier est en attente mais NON payé */}
                    {status === 'PENDING' && !isPaid && (
                        <DropdownMenuItem disabled className="text-muted-foreground opacity-70">
                            <Banknote className="mr-2 h-4 w-4" />
                            En attente de paiement
                        </DropdownMenuItem>
                    )}

                    {/* Le bouton Refuser */}
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

                    {status === 'REJECTED' && (
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed italic">
                            En attente de correction...
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isRefuseDialogOpen} onOpenChange={setIsRefuseDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Refuser ce dossier ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Le statut passera à <strong>REFUSÉ</strong>.<br />
                            L'adhérent devra corriger ses informations.
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