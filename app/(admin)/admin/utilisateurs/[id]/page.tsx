import getUser from "@/src/features/users/dal";
import UserInfo from "@/src/features/users/admin/user-gestion/UserInfo";
import ErrorCard from "@/components/common/feedback/ErrorCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function UserDetailsPage({ params }: PageProps) {

    const { id } = await params;
    const user = await getUser(id);

    if (!user || user === null) {
        return (
            <ErrorCard
                title={"Utilisateur non trouvée"}
                message={""}
                link={"/admin/utilisateurs"}
                linkMessage={"Retour aux utilisateurs"}
            />
        )
    }

    return (
        <>
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/utilisateurs" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux utilisateurs
                    </Link>
                </Button>
            </div>
            <UserInfo userData={user} />
        </>
    );
}