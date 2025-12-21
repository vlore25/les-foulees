
import FouleesLogo from "../../common/logo/FouleesLogo";
import { SidebarTrigger } from "@/components/ui/side-bat";

const HeaderUser = () => {
    return (
        <nav className="shadow-xs">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-1 py-4 sm:px-6">
                <SidebarTrigger />
                <FouleesLogo
                    size={100}
                    className="!w-[90px] lg:!w-[100px]"
                />
            </div>
        </nav>
    )
}

export default HeaderUser;