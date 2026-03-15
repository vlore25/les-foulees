import UserInfo from "@/src/features/users/admin/user-gestion/UserInfo";
import ErrorCard from "@/components/common/feedback/ErrorCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserDetailsAdmin } from "@/src/features/users/dal";
import PageContentAdmin from "@/components/common/PageContentAdmin";

// 1. CORRECTION ICI : Dans Next.js 15+, params doit être typé comme une Promesse
interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UserDetailsPage({ params }: PageProps) {
    // 2. L'attente (await) fonctionne maintenant parfaitement avec le bon type
    const { id } = await params;

    const user = await getUserDetailsAdmin(id);

    if (!user) {
        return (
            <ErrorCard
                title={"Utilisateur non trouvé"}
                message={""}
                link={"/admin/utilisateurs"}
                linkMessage={"Retour aux utilisateurs"}
            />
        )
    }

    return (
        <>
            <PageContentAdmin title="Informations du membre">
                <Link href="/admin/utilisateurs" className="flex items-center gap-2 font-semibold my-3">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux utilisateurs
                </Link>
                <UserInfo user={user} />
            </PageContentAdmin>

        </>
    );
}