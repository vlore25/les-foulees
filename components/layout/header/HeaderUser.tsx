
import FouleesLogo from "../../common/logo/FouleesLogo";
import { SidebarTrigger } from "@/components/ui/side-bat";

const HeaderUser = () => {
    return (
        <nav className=" border-b-1">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-2 sm:px-6">
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