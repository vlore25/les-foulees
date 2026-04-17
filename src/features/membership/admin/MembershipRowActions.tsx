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
import { MoreHorizontal, CheckCircle, XCircle, Loader2, Banknote, Trash2 } from "lucide-react";
import { validateMembershipAction, refuseMembershipAction, deleteMembershipAction } from "../memberships.actions";
import { toast } from "sonner";

interface MembershipRowActionsProps {
    id: string;
    status: string;
    paymentStatus?: string; 
}

export default function MembershipRowActions({ id, status, paymentStatus }: MembershipRowActionsProps) {
    const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const isPaid = paymentStatus === 'PAID';

    const canValidate = status !== 'VALIDATED' && status !== 'REJECTED' && isPaid;

    const handleValidate = async () => {
        startTransition(async () => {
            const result = await validateMembershipAction(id);
            if (result.success) {
                toast.success("Le dossier a été validé avec succès.");
            } else {
                toast.error(result.message || "Erreur lors de la validation du dossier.");
            }
        });
    };

    const handleRefuse = async () => {
        startTransition(async () => {
            const result = await refuseMembershipAction(id);
            if (result.success) {
                setIsRefuseDialogOpen(false);
                toast.success("Le dossier a été refusé.");
            } else {
                toast.error(result.message || "Erreur lors du refus du dossier.");
            }
        });
    };

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteMembershipAction(id);
            if (result.success) {
                setIsDeleteDialogOpen(false);
                toast.success("Le dossier a été supprimé.");
            } else {
                toast.error(result.message || "Erreur lors de la suppression du dossier.");
            }
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions sur l'adhésion">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">

                    {/* Action de validation */}
                    {canValidate && (
                        <DropdownMenuItem onClick={handleValidate} className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Valider le dossier
                        </DropdownMenuItem>
                    )}

                    {!isPaid && status === 'PENDING' && (
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed italic">
                            <Banknote className="mr-2 h-4 w-4" />
                            Attente paiement
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

                    {/* Le bouton Supprimer */}
                    {status !== 'VALIDATED' && (
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setIsDeleteDialogOpen(true);
                            }}
                            className="text-slate-600 focus:text-slate-700 focus:bg-slate-50 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer la demande
                        </DropdownMenuItem>
                    )}

                    {status === 'REJECTED' && (
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed italic">
                            En attente de correction...
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog Refus */}
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

            {/* Dialog Suppression */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. L'adhésion et son paiement associé seront définitivement supprimés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={isPending}
                            className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                            {isPending ? "Suppression..." : "Confirmer la suppression"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}