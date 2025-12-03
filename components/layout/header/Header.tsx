import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/Mobilemenu";
import FouleesLogo from "../../common/logo/FouleesLogo";
import HeaderActions from "./HeaderActions";

const Header = () => {
    return (
        <nav className="p-3">
            <div className="flex justify-between items-center lg:mx-20">
            <MobileMenu />
            <FouleesLogo />
            <DesktopMenu />
            <HeaderActions />
            </div>
        </nav>
    )
}

export default Header;


