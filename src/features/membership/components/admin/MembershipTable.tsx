'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, FileText, Download, ExternalLink } from "lucide-react";
import EmptyCategory from "@/components/common/EmptyCategory";
import MembershipRowActions from "./MembershipRowActions"; // Assurez-vous d'avoir ce composant créé précédemment

// Mise à jour de l'interface pour inclure les nouveaux champs
interface MembershipWithRelations {
    id: string;
    type: string;
    adhesionPdf: string;
    status: string;
    medicalCertificateVerified: boolean;
    certificateUrl?: string | null;
    ffaLicenseNumber?: string | null;
    user: {
        name: string;
        lastname: string;
        email: string;
        phone: string | null;
    };
    payment?: {
        status: string;
        amount: number;
    } | null;
}

interface MembershipsListProps {
    memberships: MembershipWithRelations[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'VALIDATED':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Validé</Badge>;
        case 'REJECTED':
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">Refusé</Badge>;
        case 'PENDING':
        default:
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">À vérifier</Badge>;
    }
};

export default function MembershipTable({ memberships }: MembershipsListProps) {
    console.log(memberships)
    if (!memberships || memberships.length === 0) {
        return (
            <EmptyCategory />
        );
    }

    return (
        <div className='overflow-hidden rounded-md border bg-white'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Adhérent</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Bulletin d'adhesion</TableHead>
                        <TableHead>Certificat / Licence</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {memberships.map((m) => (
                        <TableRow key={m.id}>

                            {/* COLONNE 1 : Identité */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">
                                        {m.user.lastname.toUpperCase()} {m.user.name}
                                    </span>
                                </div>
                            </TableCell>

                            {/* COLONNE 2 : Type d'adhésion */}
                            <TableCell>
                                <span className="font-medium text-sm">
                                    {formatMembershipType(m.type)}
                                </span>
                            </TableCell>

                            {/* COLONNE 3 : Bulletin PDF */}
                            <TableCell>
                                {m.adhesionPdf ? (
                                    <a
                                        href={m.adhesionPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline border border-blue-100 bg-blue-50 px-2 py-1 rounded"
                                    >
                                        <FileText className="h-3 w-3" />
                                        Bulletin
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground text-xs">N/A</span>
                                )}
                            </TableCell>

                            {/* COLONNE 4 : LOGIQUE CERTIFICAT / LICENCE */}
                            <TableCell>
                                {/* CAS 1 : C'est une LICENCE (Type 'LICENSE_RUNNING' OU numéro de licence présent) */}
                                {(m.type === 'LICENSE_RUNNING' || m.ffaLicenseNumber) ? (
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Licence FFA
                                        </Badge>
                                        {m.ffaLicenseNumber && (
                                            <span className="text-[10px] text-muted-foreground font-mono">
                                                N° {m.ffaLicenseNumber}
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    m.certificateUrl ? (
                                        <div className="flex flex-col gap-2 items-start">
                                            <a
                                                href={m.certificateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs text-purple-600 underline hover:text-purple-800 font-medium"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Voir le document
                                            </a>
                                        </div>
                                    ) : (
                                        /* CAS 3 : RIEN (Anomalie ou dossier incomplet) */
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                                            <XCircle className="w-3 h-3" /> Manquant
                                        </Badge>
                                    )
                                )}
                            </TableCell>

                            {/* COLONNE 5 : Paiement */}
                            <TableCell>
                                {m.payment?.status === 'PAID' ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {m.payment.amount}€
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1">
                                        <Clock className="w-3 h-3" /> En attente
                                    </Badge>
                                )}
                            </TableCell>

                            {/* COLONNE 6 : Statut Global */}
                            <TableCell>
                                {getStatusBadge(m.status)}
                            </TableCell>

                            {/* COLONNE 7 : Actions */}
                            <TableCell className="text-right">
                                <MembershipRowActions
                                    id={m.id}
                                    status={m.status}
                                />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function formatMembershipType(type: string) {
    const map: Record<string, string> = {
        'INDIVIDUAL': 'Individuel',
        'COUPLE': 'Couple',
        'YOUNG': 'Jeune (-18)',
        'LICENSE_RUNNING': 'Licence FFA'
    };
    return map[type] || type;
}