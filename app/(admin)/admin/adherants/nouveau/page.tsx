import { prisma } from "@/src/lib/prisma";
import { ManualMembershipForm } from "@/src/features/membership/admin/ManualMembershipForm";

export default async function NouveauAdherantPage() {
    // Charger toutes les saisons pour le select
    const seasons = await prisma.season.findMany({
        orderBy: { startDate: 'desc' },
        select: {
            id: true,
            name: true,
            priceStandard: true,
            priceCouple: true,
            priceYoung: true,
            priceFfa: true,
            isOpenForRegistration: true,
        }
    });

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
            <ManualMembershipForm seasons={seasons} />
        </div>
    );
}
