'use client'

import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookUser, CreditCard,  Banknote } from "lucide-react";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import MembershipRowActions from "./MembershipRowActions";
import { cn } from "@/src/lib/utils";
import { TypographyDetail } from "@/components/ui/typography";
import { UserName } from "@/components/ui/user-name";

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
        payment?: {
            status: string;
        } | null;
    } | null;
}

interface MembershipSimpleListProps {
    memberships: MembershipWithRelations[];
}

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'VALIDATED':
            return { label: 'Validé', color: 'bg-green-100 text-green-700' };
        case 'REJECTED':
            return { label: 'Refusé', color: 'bg-red-100 text-red-700' };
        case 'PENDING':
        default:
            return { label: 'À vérifier', color: 'bg-yellow-100 text-yellow-700' };
    }
};

export default function MembershipSimpleList({ memberships }: MembershipSimpleListProps) {
    if (!memberships || memberships.length === 0) {
        return (
            <EmptyCategory emptyIcon={BookUser} text="Aucune adhésion trouvée"/>
        );
    }

    return (
        <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-md overflow-hidden">
            {memberships.map((m) => {
                const statusInfo = getStatusInfo(m.status);
                const finalPaymentStatus = m.payment?.status || m.partner?.payment?.status;
                const isPaid = finalPaymentStatus === 'PAID';

                return (
                    <div 
                        key={m.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4"
                    >
                        {/* IDENTITÉ ET TYPE */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                <Banknote size={24} />
                            </div>
                            <div className="min-w-0">
                                <div className="text-slate-900 text-base tracking-tight truncate">
                                    <UserName name={m.user.name} lastname={m.user.lastname} />
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <TypographyDetail>
                                        {formatMembershipType(m.type)}
                                    </TypographyDetail>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <CreditCard size={14} className={isPaid ? "text-green-500" : "text-slate-400"} />
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-tighter",
                                            isPaid ? "text-green-600" : "text-slate-500"
                                        )}>
                                            {isPaid ? 'Payé' : 'Attente'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DOCUMENTS ET STATUT */}
                        <div className="flex items-center gap-6 sm:gap-10 justify-between sm:justify-end">
                            {/* Document */}
                            <div className="hidden md:flex flex-col items-end gap-1">
                                {(m.type === 'LICENSE_RUNNING' || m.ffaLicenseNumber) ? (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-black uppercase text-blue-500 tracking-tighter">Licence FFA</span>
                                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{m.ffaLicenseNumber || "N/A"}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs font-black uppercase text-slate-400 tracking-tighter">Certificat</span>
                                        {m.certificateUrl ? (
                                            <a
                                                href={m.certificateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded transition-colors"
                                            >
                                                <ExternalLink size={12} />
                                                Voir
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-red-500 uppercase italic">Manquant</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Status Badge */}
                            <Badge className={cn("border-none font-black uppercase tracking-widest text-xs px-3 py-1 h-auto rounded-md shadow-sm", statusInfo.color)}>
                                {statusInfo.label}
                            </Badge>

                            {/* Actions */}
                            <MembershipRowActions
                                id={m.id}
                                status={m.status}
                                paymentStatus={finalPaymentStatus}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
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
