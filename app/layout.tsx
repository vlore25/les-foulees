import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/common/header/Header";
import "./globals.css";
import UserProvider from "@/components/providers/UserProvider";
import { getCurrentUser } from "./actions/user";

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

const user = await getCurrentUser();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
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
