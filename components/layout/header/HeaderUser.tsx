
import { Button } from "@/components/ui/button";
import FouleesLogo from "../../common/logo/FouleesLogo";
import { SidebarTrigger } from "@/components/ui/side-bat";
import Link from "next/link";

const HeaderUser = () => {
    return (
        <nav className="shadow-xs">
            <div className="flex items-center justify-between gap-4 px-2 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                </div>
                
                <Button asChild className="font-bold uppercase tracking-widest text-xs">
                    <Link href={"/"}>Accueil</Link>
                </Button>
            </div>
        </nav>
    )
}

export default HeaderUser;