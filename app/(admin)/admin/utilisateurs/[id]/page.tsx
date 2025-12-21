import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import getUser from "@/src/features/users/dal";
import UserInfo from "@/src/features/users/admin/user-gestion/UserInfo";
import ErrorCard from "@/components/common/ErrorCard";

interface PageProps {
    params: {
        userId: string;
    };
}

export default async function UserDetailsPage({ params }: PageProps) {
    const { userId } = await params;
    console.log("qrvqevrqerv")

    const user = await getUser(userId);

    if (!user) {
        return(
            <ErrorCard 
            title={"Utilisateur non trouvée"}
            message={""}
            link={"/admin/dashboard/users"}
            linkMessage={"Retour aux utilisateurs"}
            />
        )
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/dashboard?tab=user" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux liste d'utilisateurs
                    </Link>
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Modifier l'événement</h1>
            </div>
            <UserInfo userData={user} />
        </div>
    );
}