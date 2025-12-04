import AdminShell from "../../../../src/features/admin/AdminShell"; // Ajustez le chemin selon où vous avez créé le fichier

export const metadata = {
  title: "Administration",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}