import { Button } from "@/components/ui/button";
import AdminMenu from "@/src/features/admin/admin-menu/AdminMenu";
import { AdminLink } from "@/src/features/admin/admin-menu/components/AdminLink";
import UserMenu from "@/src/features/user/user-menu/UserMenu";
import { getCurrentUser } from "@/src/features/users/dal";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function HeaderActions() {
    const user = await getCurrentUser();
    return (
        <div>
        {user ? <UserMenu /> : <LoginButton />}
        {user?.role == "ADMIN" && <AdminLink/>}
        </div>
    );

}

function LoginButton() {
    return (
        <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href='/login'>
                <LogIn className="size-4" />
                <span className="hidden md:block">
                    Connexion
                </span>
            </Link>
        </Button>
    );
}

