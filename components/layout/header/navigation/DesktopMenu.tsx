"use client"

import Link from "next/link";
import navItems from "./NavItems";

const DesktopMenu = () => {
    return (
        <nav className="hidden lg:flex gap-6">
            {navItems.map((item) => (
                <Link key={item.title} href={item.href} className="font-semibold group">
                    {item.title}
                    <div className="bg-primary h-[2px] w-0 group-hover:w-full transition-all duration-300"></div>
                </Link>

            ))}
        </nav>
    );
}
export default DesktopMenu;