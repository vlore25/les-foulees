import LoginForm from "@/app/auth/login/components/LoginForm";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { getSession } from "@/lib/auth";
import { LogIn, User2 } from "lucide-react";

const session = await getSession()
const UserMenu = () => {
    
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                   {!session? <LogIn /> : <User2 />} 
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