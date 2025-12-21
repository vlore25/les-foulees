import HeaderUser from "@/components/layout/header/HeaderUser";
import { ItemsNavAdmin } from "@/components/layout/sidebar/ItemsNav";
import { SidebarApp } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/side-bat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration | Les Foulées Avrillaises",
  description: "Espace de gestion de l'association",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <SidebarApp navItems={ItemsNavAdmin} />
        <div className="min-h-screen w-full bg-background font-sans antialiased">
          <HeaderUser />
          {children}
        </div>
      </SidebarProvider>
  );
}