import { Button } from "@/components/ui/button";
import LoginButton from "@/src/features/auth/components/buttons/LoginButton";
import { verifySessionExternal } from "@/src/lib/session";
import Link from "next/link";


export async function PortalButton() {
    const session = await verifySessionExternal();
    return (
        session.isAuth ?
            <Button>
                <Link href="/espace-membre/annuaire">
                    Espace membre
                </Link>
            </Button>
            :
            <LoginButton />
    )

}