"use client"

import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrickWallShield } from "lucide-react";
import AdminNav from "../../../../src/features/admin/admin-menu/components/AdminNav";



const AdminMenu = () => {
    
    return (

        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                   <BrickWallShield />
                </SheetTrigger>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Menu Connexion</SheetTitle> 
                        <FouleesLogo />
                        <SheetDescription className="sr-only">
                        </SheetDescription>
                    </SheetHeader>
                    <AdminNav />
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default AdminMenu;