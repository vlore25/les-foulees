import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/Mobilemenu";
import FouleesLogo from "../../common/logo/FouleesLogo";
import LoginButton from "@/src/features/auth/components/buttons/LoginButton";
import { verifySessionExternal } from "@/src/lib/session";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Header = () => {
    return (
        <nav className="p-1 lg:p-2">
            <div className="flex justify-between items-center min-w-0 max-w-7xl mx-auto px-1 lg:px-8">
                <div className="flex-shrink-0">
                    <FouleesLogo
                        size={100}
                        className="!w-[90px] lg:!w-[100px]"
                    />
                </div>
                <DesktopMenu />
                <MobileMenu />
                <div className="hidden lg:flex">
                    <PortalButton />
                </div>
            </div>
        </nav>
    )
}

export default Header;

async function PortalButton() {
    const session = await verifySessionExternal();
    return (
        session.isAuth ? <Button>
            <Link href="/espace-membre/annuaire">
             Espace membre
            </Link></Button> : <LoginButton />
    )

}