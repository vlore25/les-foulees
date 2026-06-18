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
import { MoreHorizontal, CheckCircle, XCircle, Loader2, Banknote, Trash2, Eye, Calendar, User, FileText, Activity, StickyNote } from "lucide-react";
import { validateMembershipAction, refuseMembershipAction, deleteMembershipAction, getMembershipDetailsAction } from "../memberships.actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TypographyH3, TypographyP, TypographyDetail } from "@/components/ui/typography";
import { UserName } from "@/components/ui/user-name";
import { Badge } from "@/components/ui/badge";

interface MembershipRowActionsProps {
    id: string;
    status: string;
    paymentStatus?: string; 
}

export default function MembershipRowActions({ id, status, paymentStatus }: MembershipRowActionsProps) {
    const [isRefuseDialogOpen, setIsRefuseDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
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

                    {/* Action de détails */}
                    <DropdownMenuItem
                        onSelect={async (e) => {
                            e.preventDefault();
                            setIsDetailsOpen(true);
                            if (!details) {
                                setIsLoadingDetails(true);
                                const result = await getMembershipDetailsAction(id);
                                if (result.success) {
                                    setDetails(result.data);
                                }
                                setIsLoadingDetails(false);
                            }
                        }}
                        className="text-blue-600 focus:text-blue-700 focus:bg-blue-50 cursor-pointer"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                    </DropdownMenuItem>

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

            {/* Dialog Détails */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-md border-none shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle>Détails de la demande</DialogTitle>
                    </DialogHeader>

                    {isLoadingDetails ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : details ? (
                        <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2-1 lg:grid-cols-2 items-center justify-between">
                                <div className="space-y-1">
                                    <UserName name={details.user.name} lastname={details.user.lastname} className="text-xl" />
                                    <TypographyDetail className="block text-slate-500">
                                        Demande créée le {new Date(details.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </TypographyDetail>
                                    <TypographyDetail className="block text-slate-500">
                                        Dernière modification le {new Date(details.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </TypographyDetail>
                                </div>
                                <Badge variant={details.status === 'VALIDATED' ? 'default' : details.status === 'REJECTED' ? 'destructive' : 'secondary'} className="px-3 py-1 text-xs">
                                    {details.status === 'VALIDATED' ? 'Validé' : details.status === 'REJECTED' ? 'Refusé' : 'À vérifier'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                        <User size={18} />
                                        <TypographyH3 className="text-primary text-lg">Contact</TypographyH3>
                                    </div>
                                    <div className="space-y-1">
                                        <TypographyP className="text-sm font-medium">{details.user.email}</TypographyP>
                                        <TypographyP className="text-sm font-medium">{details.user.phone || "Pas de téléphone"}</TypographyP>
                                        <TypographyP className="text-sm font-medium">{details.user.address}, {details.user.zipCode} {details.user.city}</TypographyP>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                        <StickyNote size={18} />
                                        <TypographyH3 className="text-primary text-lg">Type d'adhésion</TypographyH3>
                                    </div>
                                    <div className="space-y-1">
                                        <TypographyP className="text-sm font-bold text-slate-800">
                                            {formatMembershipType(details.type)}
                                        </TypographyP>
                                        {details.ffaLicenseNumber && (
                                            <TypographyP className="text-sm text-slate-600">Licence FFA: {details.ffaLicenseNumber}</TypographyP>
                                        )}
                                        {details.previousClub && (
                                            <TypographyP className="text-sm text-slate-600">Ancien club: {details.previousClub}</TypographyP>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {details.partner && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary border-b border-primary/10 pb-2">
                                        <User size={18} />
                                        <TypographyH3 className="text-primary text-lg">Partenaire (Couple)</TypographyH3>
                                    </div>
                                    <UserName name={details.partner.user.name} lastname={details.partner.user.lastname} className="text-sm" />
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-500">
                            Données indisponibles.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function formatMembershipType(type: string) {
    const map: Record<string, string> = {
        'INDIVIDUAL': 'Individuel',
        'YOUNG': 'Jeune',
        'LICENSE_RUNNING': 'Licence FFA',
        'COUPLE': 'Couple'
    };
    return map[type] || type;
}