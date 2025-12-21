import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/Mobilemenu";
import FouleesLogo from "../../common/logo/FouleesLogo";
import HeaderActions from "./HeaderActions";
import { SidebarTrigger } from "@/components/ui/side-bat";

const HeaderUser = () => {
    return (
        <nav className="p-2 lg:p-3 border-b-2">
            <div className="flex items-center min-w-0 max-w-7xl mx-auto px-4 lg:px-8">
                <SidebarTrigger className="self-start" />
                <FouleesLogo
                    size={100}
                    className="!w-[90px] lg:!w-[120px]"
                />
            </div>
        </nav>
    )
}

export default HeaderUser;