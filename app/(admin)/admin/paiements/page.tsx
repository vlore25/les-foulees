import PageContentAdmin from "@/components/common/PageContentAdmin";
import { getAllPayments } from "@/src/features/payments/dal";
import AdminPaymentsList from "@/src/features/payments/components/AdminPaymentsList";
import { TypographyPageDescription } from "@/components/ui/typography";

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <PageContentAdmin title="Gestion des paiements">
      <div className="space-y-4">
        <TypographyPageDescription>
            Consultez et validez les paiements des adhérents avant de valider leur dossier.
        </TypographyPageDescription>
        <AdminPaymentsList payments={payments} />
      </div>
    </PageContentAdmin>
  );
}
