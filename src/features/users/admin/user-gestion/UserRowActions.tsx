"use client";

import { useState } from "react"; // 1. Ajout de l'état pour contrôler l'ouverture
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";
import { statusUserAction } from "../../user.action";
import { toast } from "sonner"; // Utilisation correcte de toast

export function UserRowActions({ userId }: { userId: string }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeactivate = async () => {
        try {
            await statusUserAction(userId);
            toast.success("Le statut de l'utilisateur a été mis à jour.");
        } catch (error) {
            toast.error("Une erreur est survenue lors de la désactivation.");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                        
                    </DropdownMenuItem>

                    {/* 2. On utilise onSelect pour empêcher la fermeture automatique et déclencher le dialogue */}
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault();
                            setShowDeleteDialog(true);
                        }}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Désactiver compte</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 3. L'AlertDialog est placé en dehors du Dropdown pour éviter les conflits de DOM */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            L'utilisateur ne pourra plus se connecter. Pour effacer définitivement le compte, veuillez vous diriger vers la section des comptes désactivés.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeactivate}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Continuer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}