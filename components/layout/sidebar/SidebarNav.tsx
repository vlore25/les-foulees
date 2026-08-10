"use client"

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/side-bat";
import { ItemsNavAdmin, ItemsNavUser } from "./ItemsNav";
import Link from "next/link";

interface SidebarNavProps {
  type: "ADMIN" | "USER";
  isAdmin: boolean;
}

export function SidebarNav({ type, isAdmin }: SidebarNavProps) {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const mountedPathnameRef = useRef(pathname);

  useEffect(() => {
    if (mountedPathnameRef.current !== pathname) {
      setOpenMobile(false);
      mountedPathnameRef.current = pathname;
    }
  }, [pathname, setOpenMobile]);

  const navItems = type === "ADMIN" ? ItemsNavAdmin : ItemsNavUser;

  return (
    <SidebarContent className="pt-4">
      {navItems.map((section) => {
        if (section.adminOnly && !isAdmin) {
          return null;
        }
        return (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <Icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )
      })}
    </SidebarContent>
  );
}
