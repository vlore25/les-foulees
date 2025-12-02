import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/common/header/Header";
import "./globals.css";
import { getCurrentUser } from "@/lib/dal";
import UserProvider from "@/components/providers/UserProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider user={user}>
        <Header />
        {children}
        </UserProvider>
      </body>
    </html>
  );
}
