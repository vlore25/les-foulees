import UserMenu from "@/src/features/account/user-menu/UserMenu";
import LoginButton from "@/src/features/auth/login/components/LoginButtonNav";
import { getCurrentUser } from "@/src/features/users/dal";

export default async function HeaderActions() {
    const user = await getCurrentUser();
    return (
        <div>
            {user ? <UserMenu /> : <LoginButton />}
        </div>
    );

}


