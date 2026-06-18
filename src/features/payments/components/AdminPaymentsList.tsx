'use client'

import { Badge } from "@/components/ui/badge";
import { CreditCard, User, Calendar, Banknote } from "lucide-react";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import PaymentRowActions from "./PaymentRowActions";
import { cn, getAssetUrl } from "@/src/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaymentStatus, PaymentMethod } from "@/prisma/generated/enums";
import { TypographyDetail } from "@/components/ui/typography";
import { UserName } from "@/components/ui/user-name";

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
    profileImageUrl?: string;
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
              <Avatar className="h-10 w-10 border border-slate-100 shrink-0">
                <AvatarImage src={getAssetUrl(p.user.profileImageUrl)} className="object-cover" />
                <AvatarFallback className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                    {p.user.name?.[0]}{p.user.lastname?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="text-slate-900 text-sm truncate">
                  <UserName name={p.user.name} lastname={p.user.lastname} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-semibold text-slate-700">
                    {p.amount.toFixed(2)} €
                  </span>
                  <span className="text-slate-300">•</span>
                  <TypographyDetail className="capitalize">
                    {getMethodLabel(p.method)}
                  </TypographyDetail>
                </div>
              </div>
            </div>

            {/* DATE ET STATUT */}
            <div className="flex items-center gap-6 sm:gap-8 justify-between sm:justify-end">
              <div className="hidden md:flex flex-col items-end gap-1">
                <TypographyDetail className="text-[10px]">Date</TypographyDetail>
                <span className="text-xs font-medium text-slate-500 leading-none">
                  {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <Badge className={cn("border-none font-semibold text-[10px] px-2 h-5 rounded-sm", statusInfo.color)}>
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
