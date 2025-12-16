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
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyCategory from "@/components/common/EmptyCategory";

// On définit le type attendu (incluant les relations)
interface MembershipWithRelations {
    id: string;
    type: string;
    adhesionPdf: string;
    status: string;
    medicalCertificateVerified: boolean;
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

export default function MembershipTable({ memberships }: MembershipsListProps) {

    // Si la liste est vide (après filtrage ou au début)
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
                        <TableHead>Certificat</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Statut Global</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                    <span className="text-xs text-slate-500">{m.user.email}</span>
                                </div>
                            </TableCell>

                            {/* COLONNE 2 : Type d'adhésion */}
                            <TableCell>
                                <span className="font-medium">
                                    {formatMembershipType(m.type)}
                                </span>
                            </TableCell>
                            <TableCell>
                                {m.adhesionPdf ? (
                                    <a
                                        href={m.adhesionPdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                    >
                                        <Download className="h-3 w-3" />
                                        Télécharger
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Non disponible</span>
                                )}
                            </TableCell>

                            {/* COLONNE 3 : Certificat Médical */}
                            <TableCell>
                                {m.medicalCertificateVerified ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> OK
                                    </Badge>
                                ) : (
                                    // Si c'est une licence FFA, pas besoin de certif, sinon Alerte
                                    m.type === 'LICENSE_RUNNING' ? (
                                        <Badge variant="outline" className="text-slate-500">Licence FFA</Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                                            <XCircle className="w-3 h-3" /> Manquant
                                        </Badge>
                                    )
                                )}
                            </TableCell>

                            {/* COLONNE 4 : Paiement */}
                            <TableCell>
                                {m.payment?.status === 'PAID' ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {m.payment.amount}€
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
                                        <Clock className="w-3 h-3" /> En attente
                                    </Badge>
                                )}
                            </TableCell>

                            {/* COLONNE 5 : Statut Global */}
                            <TableCell>
                                {m.status === 'VALIDATED' ? (
                                    <Badge className="bg-green-600 hover:bg-green-700">Validé</Badge>
                                ) : (
                                    <Badge variant="secondary">Incomplet</Badge>
                                )}
                            </TableCell>

                            {/* COLONNE 6 : Actions */}
                            <TableCell className="text-right">
                                {/* Tu pourras mettre ici ton composant d'édition */}
                                <Button variant="ghost" size="sm">Gérer</Button>
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
        'INDIVIDUAL': 'Individuel (35€)',
        'COUPLE': 'Couple (60€)',
        'YOUNG': 'Jeune (25€)',
        'LICENSE_RUNNING': 'Licence FFA (98€)'
    };
    return map[type] || type;
}