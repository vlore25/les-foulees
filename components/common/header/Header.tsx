import DesktopMenu from "./components/navigation/DesktopMenu";
import MobileMenu from "./components/navigation/Mobilemenu";
import UserMenu from "./components/user-menu/UserMenu";
import FouleesLogo from "../logo/FouleesLogo";
import AdminMenu from "./components/admin-menu/AdminMenu";

const Header = () => {

    return (
        <nav className="flex justify-between items-center p-3">
            <MobileMenu />
            <FouleesLogo />
            <DesktopMenu />
            <UserMenu />
            <AdminMenu />
        </nav>
    )
}

export default Header;