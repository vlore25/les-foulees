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
import { CheckCircle2, XCircle, ExternalLink, BookUser, Heart } from "lucide-react";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import MembershipRowActions from "./MembershipRowActions";

interface MembershipWithRelations {
    id: string;
    type: string;
    status: string;
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
    partner?: {
        user?: {
            name: string;
            lastname: string;
        } | null;
        payment?: {
            status: string;
        } | null;
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
    if (!memberships || memberships.length === 0) {
        return (
            <EmptyCategory emptyIcon={BookUser} text="Aucune adhésion trouvée pour cette saison."/>
        );
    }

    return (
        <div className='overflow-x-auto rounded-lg border bg-white shadow-sm'>
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="font-bold text-slate-700 uppercase text-xs tracking-wider">Adhérent</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase text-xs tracking-wider">Type / Duo</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase text-xs tracking-wider">Certificat / Licence</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase text-xs tracking-wider">Statut</TableHead>
                        <TableHead className="font-bold text-slate-700 uppercase text-xs tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {memberships.map((m) => {
                        const finalPaymentStatus = m.payment?.status || m.partner?.payment?.status;
                        const partnerName = m.partner?.user ? `${m.partner.user.name} ${m.partner.user.lastname}` : null;

                        return (
                            <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">

                                {/* COLONNE 1 : Identité */}
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 text-sm">
                                            {m.user.lastname.toUpperCase()} {m.user.name}
                                        </span>
                                        <span className="text-xs text-slate-500 italic">
                                            {m.user.email}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* COLONNE 2 : Type d'adhésion et Partenaire */}
                                <TableCell>
                                    <div className="flex flex-col gap-1.5">
                                        <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 bg-slate-100 text-slate-700 border-slate-200 w-fit">
                                            {formatMembershipType(m.type)}
                                        </Badge>
                                        {m.type === 'COUPLE' && partnerName && (
                                            <div className="flex items-center gap-1 text-[10px] text-pink-600 font-bold uppercase tracking-tight">
                                                <Heart className="w-3 h-3 fill-pink-600" aria-label="Partenaire" />
                                                <span>Duo avec {partnerName}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>


                                <TableCell>
                                    {(m.type === 'LICENSE_RUNNING' || m.ffaLicenseNumber) ? (
                                        <div className="flex flex-col gap-1.5">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit gap-1.5 py-1 text-xs font-bold">
                                                <CheckCircle2 className="w-3.5 h-3.5" aria-label="Vérifié" /> Licence FFA
                                            </Badge>
                                            {m.ffaLicenseNumber && (
                                                <span className="text-xs text-muted-foreground font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 w-fit">
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
                                                    className="flex items-center gap-1.5 text-sm text-purple-600 underline hover:text-purple-800 font-bold transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" aria-label="Lien externe" />
                                                    Voir le document
                                                </a>
                                            </div>
                                        ) : (
                                            /* CAS 3 : RIEN (Anomalie ou dossier incomplet) */
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 py-1 text-xs font-bold">
                                                <XCircle className="w-3.5 h-3.5" aria-label="Erreur" /> Manquant
                                            </Badge>
                                        )
                                    )}
                                </TableCell>

                  
                                <TableCell>
                                    <div className="scale-110 origin-left">
                                        {getStatusBadge(m.status)}
                                    </div>
                                </TableCell>

        
                                <TableCell >
                                    <MembershipRowActions
                                        id={m.id}
                                        status={m.status}
                                        paymentStatus={finalPaymentStatus}
                                    />
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

function formatMembershipType(type: string) {
    const map: Record<string, string> = {
        'INDIVIDUAL': 'Individuel',
        'YOUNG': 'Jeune (-18)',
        'LICENSE_RUNNING': 'Licence FFA',
        'COUPLE': 'Couple'
    };
    return map[type] || type;
}