"use client"

import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/side-bat";
import { ItemsNavAdmin, ItemsNavUser } from "./ItemsNav";
import Link from "next/link";

interface SidebarNavProps {
  type: "ADMIN" | "USER";
  isAdmin: boolean;
}

export function SidebarNav({ type, isAdmin }: SidebarNavProps) {
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

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
                        <Link href={item.url} onClick={handleLinkClick}>
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
