import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/Mobilemenu";
import FouleesLogo from "../../common/logo/FouleesLogo";
import { PortalButton } from "./navigation/PortalButton";

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

