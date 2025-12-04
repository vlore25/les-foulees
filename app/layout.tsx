import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/providers/UserProvider";
import { getCurrentUser } from "@/src/features/user/dal";
import Header from "@/components/layout/header/Header";

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
          <div className="flex min-h-screen mx-1 lg:mx-15">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
