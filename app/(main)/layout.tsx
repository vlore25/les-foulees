import Header from "@/components/layout/header/Header";
import HeaderUser from "@/components/layout/header/HeaderUser";
import { ItemsNavUser } from "@/components/layout/sidebar/ItemsNav";
import { SidebarApp } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/side-bat";

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarApp navItems={ItemsNavUser} />
      <div className="min-h-screen w-full bg-background font-sans antialiased">
          <HeaderUser />
          <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}