import LoginButton from "@/src/features/auth/login/components/LoginButtonNav";
import UserMenu from "@/src/features/user/user-menu/UserMenu";
import { getCurrentUser } from "@/src/features/user/dal";

export default async function HeaderActions() {
    const user = await getCurrentUser();
    return (
        <div>
            {user ? <UserMenu /> : <LoginButton />}
        </div>
    );

}


