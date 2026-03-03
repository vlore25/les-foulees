export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Vend_Sans } from 'next/font/google'
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/providers/UserProvider";
import { getCurrentUser } from "@/src/features/users/dal";
import { Toaster } from "@/components/ui/sonner"

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
        <UserProvider user={user}>
          <Toaster />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
