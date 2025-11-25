import Image from "next/image";
import DesktopMenu from "./components/navigation/DesktopMenu";
import MobileMenu from "./components/navigation/Mobilemenu";
import Link from "next/link";
import UserMenu from "./components/user-menu/UserMenu";
import FouleesLogo from "../logo/FouleesLogo";

const Header = () => {


    return (
        <nav className="flex justify-between items-center p-3">
            <MobileMenu />
            <FouleesLogo />
            <DesktopMenu />
            <UserMenu />
        </nav>
    )
}

export default Header;