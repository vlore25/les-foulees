import HeaderUser from "@/components/layout/header/HeaderUser";
import { ItemsNavAdmin } from "@/components/layout/sidebar/ItemsNav";
import { SidebarApp } from "@/components/layout/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/side-bat";
import { getCurrentUser } from "@/src/features/users/dal";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administration | Les Foulées Avrillaises",
  description: "Espace de gestion de l'association",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.role !== 'ADMIN') {
    redirect('/espace-membre');
  }
  return (
    <SidebarProvider>
      <SidebarApp navItems={ItemsNavAdmin} />
      <div className="min-h-screen w-full bg-background font-sans antialiased">
        <HeaderUser />
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}