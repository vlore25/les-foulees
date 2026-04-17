import HeaderUser from "@/components/layout/header/HeaderUser";
import { SidebarApp } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/side-bat";
import { verifySession } from "@/src/lib/session";

export default async function MainGroupLayout({ children }: { children: React.ReactNode }) {
  await verifySession();
  
  return (
    <SidebarProvider>
      <SidebarApp type="USER" />
      <div className="min-h-screen w-full bg-background font-sans antialiased">
        <HeaderUser />
        <main className="px-2 md:p-2 lg:p-4 lg:px-10 max-w-6xl mb-20">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}