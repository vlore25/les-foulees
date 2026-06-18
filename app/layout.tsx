export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Vend_Sans } from 'next/font/google'
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/providers/UserProvider";
import { getCurrentUser } from "@/src/features/users/dal";
import { Toaster } from "@/components/ui/sonner"
import { GoogleTagManager } from '@next/third-parties/google'
import CookieBanner from "@/components/common/CookieBanner";

const vendSans = Vend_Sans({
  variable: "--font-vend-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-main",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lesfouleesavrillaises.fr'),
  title: {
    default: "Les Foulées Avrillaises - Club de course à pied à Avrillé",
    template: "%s | Les Foulées Avrillaises",
  },
  description: "Rejoignez Les Foulées Avrillaises, l'association de course à pied conviviale d'Avrillé (49). Entraînements, sorties, événements et esprit d'équipe !",
  keywords: ["course à pied", "running", "Avrillé", "49240", "association", "club d'athlétisme", "marathon", "trail", "les foulées avrillaises"],
  openGraph: {
    title: "Les Foulées Avrillaises",
    description: "Association de course à pied d'Avrillé (49).",
    url: "https://www.lesfouleesavrillaises.fr",
    siteName: "Les Foulées Avrillaises",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/logo/foulees-logo.png",
        width: 800,
        height: 600,
        alt: "Logo Les Foulées Avrillaises",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
      <GoogleTagManager gtmId="G-YR1YQ35J7Q" />
      <body
        className={`${vendSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider user={user}>
          <Toaster />
          <CookieBanner />
          {children}
        </UserProvider>
      </body>
      
    </html>
  );
}
