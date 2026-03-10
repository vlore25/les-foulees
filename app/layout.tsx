export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Vend_Sans } from 'next/font/google'
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/providers/UserProvider";
import { getCurrentUser } from "@/src/features/users/dal";
import { Toaster } from "@/components/ui/sonner"
import { WebVitals } from "@/components/web-vitals";

const vendSans = Vend_Sans({
  variable: "--font-vend-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-main",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Les foulees avrillaises",
  description: "Association de course à pied de la ville d'Avrillé",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await getCurrentUser();

  return (
    <html lang="fr">

      <body
        className={`${vendSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebVitals />
        <UserProvider user={user}>
          <Toaster />
          {children}
        </UserProvider>
      </body>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-YR1YQ35J7Q"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-YR1YQ35J7Q');
      </script>
    </html>
  );
}
