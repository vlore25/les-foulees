import { Footer } from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";


export default function ExternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="bg-muted/20 min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}