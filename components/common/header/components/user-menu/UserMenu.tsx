import LoginForm from "@/components/common/form/LoginForm";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { LogIn } from "lucide-react";


const UserMenu = () => {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                    <LogIn />
                </SheetTrigger>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <FouleesLogo />
                    </SheetHeader>
                        <LoginForm />
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default UserMenu;