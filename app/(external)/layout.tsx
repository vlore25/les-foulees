import Header from "@/components/layout/header/Header";

export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mx-1 lg:mx-15">
        {children}
      </main>
    </div>
  );
}