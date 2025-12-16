'use client'

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle} from "lucide-react";
import { validateMembershipAction } from "../../memberships.actions"; // Import de votre action existante

interface MembershipRowActionsProps {
    id: string;
    status: string;
}

export default function MembershipRowActions({ id, status }: MembershipRowActionsProps) {

    const handleValidate = async () => {
        const result = await validateMembershipAction(id);
        
        if (result.success) {
            console.log("Dossier validé");
        } else {
            console.error("Erreur validation");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {status !== 'VALIDATED' && (
                    <DropdownMenuItem onClick={handleValidate} className="text-green-600 focus:text-green-700 focus:bg-green-50">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Valider le dossier & Paiement
                    </DropdownMenuItem>
                )}
                
                {/* Vous pourrez ajouter d'autres actions ici plus tard, comme "Refuser" */}
                <DropdownMenuItem onClick={() => console.log("Voir détails")} >
                    Voir les détails
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}