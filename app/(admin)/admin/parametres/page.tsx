import { getSiteConfig, getTrainingSchedules } from "@/src/features/site-config/dal";
import { SiteConfigManager } from "@/src/features/site-config/admin/SiteConfigManager";
import { TypographyH1, TypographyPageDescription } from "@/components/ui/typography";

export const metadata = {
    title: "Paramètres du site | Admin",
};

export default async function AdminSiteConfigPage() {
    const config = await getSiteConfig();
    const schedules = await getTrainingSchedules();

    return (
        <div className="space-y-6">
            <div className="border-b">
                <TypographyH1>Paramètres du site</TypographyH1>
            </div>

            <SiteConfigManager 
                initialConfig={config} 
                initialSchedules={schedules} 
            />
        </div>
    );
}
