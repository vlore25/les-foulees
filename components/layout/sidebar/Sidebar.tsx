import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/side-bat";
import UserCard from "@/src/features/account/user-menu/components/UserCard";
import { NavSection } from "./ItemsNav";
import Link from "next/link";
import { getCurrentUser } from "@/src/features/users/dal";
import LogoutButton from "@/src/features/auth/logout/LogoutButton";

interface SidebarAppProps {
  navItems: NavSection[];
}
export async function SidebarApp({ navItems }: SidebarAppProps) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMIN' ? true : false;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <UserCard />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {navItems.map((section) => {
          if(section.adminOnly && !isAdmin ){
            return null;
          }
          return (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  return(
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon/>
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
        <SidebarGroup>
          <SidebarGroupLabel>Session</SidebarGroupLabel>
          <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="p" asChild>
                    <LogoutButton/>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}