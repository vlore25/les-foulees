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
        <main className="p-1 md:p-2 lg:p-4 lg:px-10 max-w-6xl">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}