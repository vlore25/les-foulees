'use client'

import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Calendar, Banknote } from "lucide-react";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import PaymentRowActions from "./PaymentRowActions";
import { cn } from "@/src/lib/utils";
import { PaymentStatus, PaymentMethod } from "@/prisma/generated/enums";

interface PaymentWithRelations {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  user: {
    name: string;
    lastname: string;
    email: string;
  };
  memberships?: {
    season: {
      name: string;
    }
  }[];
}

interface AdminPaymentsListProps {
  payments: any[];
}

const getStatusInfo = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return { label: 'Payé', color: 'bg-green-100 text-green-700' };
    case PaymentStatus.FAILED:
      return { label: 'Échoué', color: 'bg-red-100 text-red-700' };
    case PaymentStatus.PENDING:
    default:
      return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700' };
  }
};

const getMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CHECK: return 'Chèque';
    case PaymentMethod.TRANSFER: return 'Virement';
    default: return method;
  }
};

export default function AdminPaymentsList({ payments }: AdminPaymentsListProps) {
  if (!payments || payments.length === 0) {
    return (
      <EmptyCategory emptyIcon={CreditCard} text="Aucun paiement trouvé"/>
    );
  }

  return (
    <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-md overflow-hidden">
      {payments.map((p) => {
        const statusInfo = getStatusInfo(p.status);
        return (
          <div 
            key={p.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors gap-4"
          >
            {/* IDENTITÉ ET MONTANT */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <Banknote size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 uppercase text-sm tracking-tight truncate">
                  {p.user.lastname} <span className="text-primary">{p.user.name}</span>
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-black text-slate-700">
                    {p.amount.toFixed(2)} €
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {getMethodLabel(p.method)}
                  </span>
                </div>
              </div>
            </div>

            {/* DATE ET STATUT */}
            <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Date</span>
                <span className="text-[10px] font-bold text-slate-500 leading-none">
                  {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <Badge className={cn("border-none font-black uppercase tracking-widest text-[9px] px-2 h-5 rounded-sm", statusInfo.color)}>
                {statusInfo.label}
              </Badge>

              <PaymentRowActions id={p.id} status={p.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
