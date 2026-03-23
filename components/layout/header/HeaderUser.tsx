
import { Button } from "@/components/ui/button";
import FouleesLogo from "../../common/logo/FouleesLogo";
import { SidebarTrigger } from "@/components/ui/side-bat";
import Link from "next/link";

const HeaderUser = () => {
    return (
        <nav className="shadow-xs">
            <div className="flex items-center justify-between gap-4 px-2 sm:px-6 py-4">
                <SidebarTrigger />
                <Button asChild>
                    <Link
                        href={"/"}
                    >
                        Accueil
                    </Link>
                </Button>
            </div>
        </nav>
    )
}

export default HeaderUser;