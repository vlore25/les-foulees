import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/side-bat";

import { NavSection } from "./ItemsNav";
import Link from "next/link";
import { getCurrentUser } from "@/src/features/users/dal";
import LogoutButton from "@/src/features/auth/components/buttons/LogoutButton";
import UserCard from "@/src/features/account/components/UserCard";
import FouleesLogo from "@/components/common/logo/FouleesLogo";

interface SidebarAppProps {
  navItems: NavSection[];
}
export async function SidebarApp({ navItems }: SidebarAppProps) {
  const user = await getCurrentUser();

  const isAdmin = user?.role === 'ADMIN' ? true : false;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="sm:mx-auto">
        <FouleesLogo
          size={100}
          className="!w-[90px] lg:!w-[100px] self-center"
        />
        
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon />
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
      <SidebarFooter className="mb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <UserCard />
              {/*<LogoutButton />*/}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}