import { Sidebar, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/side-bat";

import { getCurrentUser } from "@/src/features/users/dal";
import UserCard from "@/src/features/account/components/UserCard";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { SidebarNav } from "./SidebarNav";

interface SidebarAppProps {
  type: "ADMIN" | "USER";
}
export async function SidebarApp({ type }: SidebarAppProps) {
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
      
      <SidebarNav type={type} isAdmin={isAdmin} />

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