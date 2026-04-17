"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import navItems from "./NavItems";
import { cn } from "@/src/lib/utils";

const DesktopMenu = () => {
    return (
        <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1 xl:gap-2">
                {navItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        <NavigationMenuLink asChild className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-primary/5 text-lg font-medium transition-all duration-300"
                        )}>
                            <Link href={item.href}>
                                {item.title}
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default DesktopMenu;