"use client";

import LoginForm from "@/app/auth/login/components/LoginForm";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogIn, User2 } from "lucide-react";
import UserNav from "./components/UserNav";
import { useUser } from "@/components/providers/UserProvider"; 
import { useState } from "react";


const UserMenu = () => {
    const user = useUser(); 
    const [isConnected, setIsconnected] = useState(user)
    
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                   {!isConnected? <LogIn /> : <User2 />} 
                </SheetTrigger>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Menu Connexion</SheetTitle> 
                        <FouleesLogo />
                        <SheetDescription className="sr-only">
                        </SheetDescription>
                    </SheetHeader>
                    
                    {/* Conditional Rendering based on Provider data */}
                    {!isConnected ? <LoginForm /> : <UserNav />} 
                        
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default UserMenu;