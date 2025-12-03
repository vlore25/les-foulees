"use client";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User2 } from "lucide-react";
import UserNav from "./components/UserNav";
import UserCard from "./components/UserCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LogoutButton from "../../auth/logout/LogoutButton";
import UserNavItems from "./components/UserNavItems";
import Link from "next/link";

const UserMenu = () => {
    return (
        <>
            <DesktopMenu />
            <MobileMenu />
        </>
    );
}

const DesktopMenu = () => {
    return (
        <div className="hidden lg:flex">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserCard />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {UserNavItems.map((item) => {
                        // CORRECTION 2 : Gestion du retour (return) et du cas "else"
                        if (item.subItems) {
                            return (
                                <DropdownMenuSub key={item.title}>
                                    <DropdownMenuSubTrigger>{item.title}</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {item.subItems.map((subItem) => (
                                                <DropdownMenuItem key={subItem.title} asChild>
                                                    <Link href={subItem.href || "#"}>
                                                        {subItem.title}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            );
                        } 
                        
                        // Cas où il n'y a pas de sous-menu (lien simple)
                        return (
                            <DropdownMenuItem key={item.title} asChild>
                                <Link href={item.href || "#"}>
                                    {item.title}
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}
                    
                    {/* Séparateur pour le logout */}
                    <div className="h-px bg-muted my-1" /> 
                    
                    <DropdownMenuItem asChild>
                        {/* LogoutButton doit accepter des props ou être wrappé s'il contient un bouton */}
                        <div className="w-full cursor-pointer">
                             <LogoutButton />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
const MobileMenu = () => {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                    <User2 />
                </SheetTrigger>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation utilisateur</SheetTitle>
                        <FouleesLogo />
                        <SheetDescription className="sr-only">
                        </SheetDescription>
                    </SheetHeader>
                    <UserNav />
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default UserMenu;