'use client'

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, FileText, Download, ExternalLink, BookUser, User, Calendar, CreditCard } from "lucide-react";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import MembershipRowActions from "./MembershipRowActions";
import { cn } from "@/src/lib/utils";

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

interface MembershipCardListProps {
    memberships: MembershipWithRelations[];
}

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'VALIDATED':
            return { label: 'Validé', color: 'bg-green-500/10 text-green-700 border-green-200' };
        case 'REJECTED':
            return { label: 'Refusé', color: 'bg-red-500/10 text-red-700 border-red-200' };
        case 'PENDING':
        default:
            return { label: 'À vérifier', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200' };
    }
};

export default function MembershipCardList({ memberships }: MembershipCardListProps) {
    if (!memberships || memberships.length === 0) {
        return (
            <EmptyCategory emptyIcon={BookUser} text="Aucune adhésion trouvée"/>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memberships.map((m) => {
                const statusInfo = getStatusInfo(m.status);
                const finalPaymentStatus = m.payment?.status || m.partner?.payment?.status;
                const isPaid = finalPaymentStatus === 'PAID';
                
                return (
                    <Card 
                        key={m.id} 
                        className="group flex flex-col h-full border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-tl-[2rem] rounded-br-[2rem]"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="font-black uppercase text-slate-900 leading-tight">
                                        {m.user.lastname}
                                    </h3>
                                    <p className="text-sm font-bold text-primary italic">
                                        {m.user.name}
                                    </p>
                                </div>
                                <MembershipRowActions
                                    id={m.id}
                                    status={m.status}
                                    paymentStatus={finalPaymentStatus}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge className={cn("border-none font-black uppercase tracking-widest text-xs px-2 py-1", statusInfo.color)}>
                                    {statusInfo.label}
                                </Badge>
                                <Badge variant="outline" className="font-bold uppercase tracking-widest text-xs px-2 py-1 border-slate-200 text-slate-500">
                                    {formatMembershipType(m.type)}
                                </Badge>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <CreditCard size={16} className="text-primary shrink-0" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {isPaid ? 'Payé' : 'Attente paiement'}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-primary/5 flex items-center justify-between">
                                    {(m.type === 'LICENSE_RUNNING' || m.ffaLicenseNumber) ? (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black uppercase text-primary tracking-tighter">Licence FFA</span>
                                            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{m.ffaLicenseNumber || "N/A"}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black uppercase text-primary tracking-tighter">Certificat médical</span>
                                            {m.certificateUrl ? (
                                                <a
                                                    href={m.certificateUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-primary transition-colors underline underline-offset-2"
                                                >
                                                    <ExternalLink size={14} />
                                                    VOIR LE DOCUMENT
                                                </a>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 uppercase italic">Manquant</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
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
