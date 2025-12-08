// app/(admin)/admin/dashboard/layout.tsx

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
    <div className="min-h-screen w-full bg-background font-sans antialiased">
      {children}
    </div>
  );
}