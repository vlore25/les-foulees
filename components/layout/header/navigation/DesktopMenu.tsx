import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import navItems from "./NavItems";

const DesktopMenu = () => {
    return(
        <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList className="gap-3">
                    {navItems.map((item) => (
                        <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink asChild>
                                <Link href={item.href}><p className="text-2xl">{item.title}</p></Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
    );
}

export default DesktopMenu;