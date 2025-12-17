"use client";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Columns3Cog, User2 } from "lucide-react";
import UserNav from "./components/UserNav";
import UserCard from "./components/UserCard";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LogoutButton from "../../auth/logout/LogoutButton";
import UserNavItems from "./components/UserNavItems";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/providers/UserProvider";

interface MenuProps {
    user: ReturnType<typeof useUser>; // Récupère automatiquement le type retourné par useUser (CurrentUser | null)
}

const UserMenu = () => {
    const user = useUser();
    return (
        <>
            <DesktopMenu user={user}/>
            <MobileMenu user={user}/>
        </>
    );
}

const DesktopMenu = ({ user }: MenuProps) => {
    
    return (
        <div className="hidden lg:flex">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <UserCard />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {UserNavItems.map((item) => {
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
                        return (
                            <DropdownMenuItem key={item.title} asChild>
                                <Link href={item.href || "#"}>
                                    {item.title}
                                </Link>
                            </DropdownMenuItem>
                        );
                    })}
                    {user?.role == "ADMIN" && <DropdownMenuItem asChild>
                        <AdminLink />
                    </DropdownMenuItem>}
                    <div className="h-px bg-muted my-1" />
                    <DropdownMenuItem asChild>
                        <div className="w-full cursor-pointer">
                            <LogoutButton />
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

const MobileMenu = ({ user }: MenuProps) => {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger>
                    <User2 />
                </SheetTrigger>
                <SheetContent className="w-full">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navigation utilisateur</SheetTitle>
                        <SheetDescription className="sr-only">
                        </SheetDescription>
                    </SheetHeader>
                    {user?.role == "ADMIN" && <AdminLink />}
                    <UserNav />
                </SheetContent>
            </Sheet>
        </div>
    );
}
export default UserMenu;


function AdminLink() {
    return (
        <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/admin/dashboard">
                <Columns3Cog className="size-4" />
                <span>Espace Admin</span>
            </Link>
        </Button>
    );
}

