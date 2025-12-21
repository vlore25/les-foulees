import DesktopMenu from "./navigation/DesktopMenu";
import MobileMenu from "./navigation/Mobilemenu";
import FouleesLogo from "../../common/logo/FouleesLogo";
import LoginButton from "@/src/features/auth/login/components/LoginButtonNav";

const Header = () => {
    return (
        <nav className="p-2 lg:p-3 border-b-2">
            <div className="flex justify-between items-center min-w-0 max-w-7xl mx-auto px-4 lg:px-8">
                <MobileMenu />
                <div className="flex-shrink-0">
                    <FouleesLogo
                        size={100}
                        className="!w-[90px] lg:!w-[120px]"
                    />
                </div>
                <DesktopMenu />
                <LoginButton />
            </div>
        </nav>
    )
}

export default Header;