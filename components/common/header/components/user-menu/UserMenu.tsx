import LoginForm from "@/app/auth/login/components/LoginForm";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getSession } from "@/lib/auth";
import { LogIn, User2 } from "lucide-react";
import UserNav from "./components/UserNav";

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
                        <SheetTitle className="sr-only">Menu Connexion</SheetTitle> 
                        <FouleesLogo />
                        <SheetDescription className="sr-only">
                        </SheetDescription>
                    </SheetHeader>
                    {!session? <LoginForm /> : <UserNav />} 
                        
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default UserMenu;