'use client'

import { useTransition } from "react"
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { updatePaymentStatusAction } from "../payments.actions";
import { PaymentStatus } from "@/prisma/generated/enums";
import { toast } from "sonner";

interface PaymentRowActionsProps {
    id: string;
    status: PaymentStatus;
}

export default function PaymentRowActions({ id, status }: PaymentRowActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (newStatus: PaymentStatus) => {
        startTransition(async () => {
            const result = await updatePaymentStatusAction(id, newStatus);
            if (result.success) {
                toast.success("Statut du paiement mis à jour.");
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                    <span className="sr-only">Ouvrir menu</span>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {status !== PaymentStatus.PAID && (
                    <DropdownMenuItem 
                        onClick={() => handleUpdateStatus(PaymentStatus.PAID)} 
                        className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marquer comme payé
                    </DropdownMenuItem>
                )}
                
                {status !== PaymentStatus.PENDING && (
                    <DropdownMenuItem 
                        onClick={() => handleUpdateStatus(PaymentStatus.PENDING)} 
                        className="text-yellow-600 focus:text-yellow-700 focus:bg-yellow-50 cursor-pointer"
                    >
                        <Loader2 className="mr-2 h-4 w-4" />
                        Remettre en attente
                    </DropdownMenuItem>
                )}

                {status !== PaymentStatus.FAILED && (
                    <DropdownMenuItem 
                        onClick={() => handleUpdateStatus(PaymentStatus.FAILED)} 
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Échec du paiement
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
