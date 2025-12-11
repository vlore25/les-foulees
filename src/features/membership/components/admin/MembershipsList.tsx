import { Badge } from "@/components/ui/badge";
import getAdhesions, { getAdhesionStats } from "../../dal"; // Ton dal
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MembershipTable from "./MembershipTable";

export default async function MembershipsList() {

    const [stats, allMembers, pendingMembers, missingCertifMembers, validatedMembers] = await Promise.all([
        getAdhesionStats(),
        getAdhesions('ALL'),             // Récupère TOUT
        getAdhesions('PENDING_PAYMENT'), // Récupère filtré
        getAdhesions('MISSING_CERTIF'),  // Récupère filtré
        getAdhesions('VALIDATED')        // Récupère filtré
    ]);

    const tabConfig = [
        { key: 'ALL', label: 'Total', count: stats.total, data: allMembers, variant: "outline" },
        { key: 'PENDING_PAYMENT', label: 'Paiement en attente', count: stats.pendingPayment, data: pendingMembers, variant: "destructive" },
        { key: 'MISSING_CERTIF', label: 'Certif. manquant', count: stats.missingCertif, data: missingCertifMembers, variant: "destructive" },
        { key: 'VALIDATED', label: 'Validés', count: stats.validated, data: validatedMembers, variant: "default" },
    ];

    return (
        <div className="space-y-4">
            <Tabs defaultValue="ALL" className="gap-4">
                
                <TabsList className="h-auto p-2 bg-muted/50 flex flex-wrap gap-2">
                    {tabConfig.map((tab) => (
                        <TabsTrigger key={tab.key} value={tab.key} className="flex gap-2">
                            {tab.label}
                            <Badge variant={tab.variant as any} className="ml-1">
                                {tab.count}
                            </Badge>
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabConfig.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key}>
                        <MembershipTable memberships={tab.data} />
                    </TabsContent>
                ))}

            </Tabs>
        </div>
    );
}