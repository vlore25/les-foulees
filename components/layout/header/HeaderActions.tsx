import { Button } from "@/components/ui/button";
import UserMenu from "@/src/features/user/user-menu/UserMenu";
import { getCurrentUser } from "@/src/features/users/dal";
import { Columns3Cog, LogIn } from "lucide-react";
import Link from "next/link";

export default async function HeaderActions() {
    const user = await getCurrentUser();
    return (
        <div className="flex flex-row">
            {user ? <UserMenu /> : <LoginButton />}
            {user?.role == "ADMIN" && <AdminLink />}
        </div>
    );

}

function LoginButton() {
    return (
        <Button variant="ghost" asChild>
            <Link href='/login'>
                <LogIn className="size-6" />
                <span className="hidden md:block">
                    Connexion
                </span>
            </Link>
        </Button>
    );
}

function AdminLink() {
    return (
        <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/admin/dashboard">
                <Columns3Cog className="size-4" />
                <span className="hidden">Espace Admin</span>
            </Link>
        </Button>
    );
}

