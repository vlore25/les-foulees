import PageContentAdmin from "@/components/common/PageContentAdmin";
import { getAllPayments } from "@/src/features/payments/dal";
import AdminPaymentsList from "@/src/features/payments/components/AdminPaymentsList";

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <PageContentAdmin title="Gestion des paiements">
      <div className="space-y-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
            Consultez et validez les paiements des adhérents avant de valider leur dossier.
        </p>
        <AdminPaymentsList payments={payments} />
      </div>
    </PageContentAdmin>
  );
}
