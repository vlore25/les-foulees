import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { cn } from "@/src/lib/utils";
import navItems, { navItemsFooter, navItemsFooter2 } from "../header/navigation/NavItems";
import { SiFacebook } from '@icons-pack/react-simple-icons';
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import assoAdress from "@/components/const/const";

interface Footer2Props {
  className?: string;
}

const social = [
  {
    title: "Facebook",
    icon: <SiFacebook size={24} />,
    href: "#"
  },
];

const Footer = ({ className }: Footer2Props) => {
  return (
    <section className={cn("bg-primary-400 text-white-text", className)}>
      <div className="container max-w-6xl mx-auto px-4">

        <footer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 items-start">
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:col-span-2">
            <FouleesLogo size={100} className="!w-[120px] lg:!w-[150px] mb-2" />
            <div className="text-sm  space-y-1">
              <p>{assoAdress.street}</p>
              <p>{assoAdress.codePostal} {assoAdress.city}</p>
              <p>{assoAdress.region}, {assoAdress.country}</p>
            </div>
            <div className="mt-6">
              <Image
                src="/logo/avrille.png"
                alt="Ville d'Avrillé"
                width={120}
                height={70}
              />
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-lg mb-4 text-white">Liens utiles</h3>
            <ul className="space-y-3 text-sm">
              {navItems.map((item, i) => (
                <li key={i} className="hover:underline">
                  <Link href={item.href}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="font-bold text-lg mb-2 text-white">Nous suivre</h3>
            <div className="flex gap-1">
              {social.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="hover:scale-110 transition-transform p-2 bg-white/10 rounded-full"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </footer>

        <Separator className="bg-white h-[1px] w-full" />

        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-6 text-[11px] uppercase tracking-widest ">

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navItemsFooter.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="hover:text-white hover:underline transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-x-2 text-center">
            <p>Copyright © 2026 Les Foulées Avrillaises</p>
            <span className="hidden md:inline text-white">|</span>
            <p>
              Site par <a href="#" className="underline font-bold">Victor Loré</a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export { Footer };