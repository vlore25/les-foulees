import FouleesLogo from "@/components/common/logo/FouleesLogo";
import { cn } from "@/src/lib/utils";
import navItems from "../header/navigation/NavItems";
import whatsapp from "./logo/social/whatsapp.svg"
import { SiFacebook, SiWhatsapp } from '@icons-pack/react-simple-icons';
import { title } from "process";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}
const social = [
  {
    title: "Facebook",
    icon: <SiFacebook size={24} />
  },
  {
    title: "Whatsapp",
    icon: <SiWhatsapp size={24} />
  }
]
const Footer = ({



}: Footer2Props) => {
  return (
    <section className="mx-auto w-lg">
      <div className="container">
        <footer>
          <div className="flex flex-col md:flex-row justify-between md:justify-between text-center sm:text-left">
            {/*Logo*/}
            <FouleesLogo
              size={100}
              className="!w-[90px] lg:!w-[100px]" />
            {/*Links*/}
            <ul>
              <h3>Liens utiles:</h3>
              {navItems.map((item, itemIndex) => {

                return (
                  <li key={itemIndex} className="">{item.title}</li>
                )
              })}
            </ul>
            {/*Socials*/}
            <div>
              <h3>Trouvez-nous en:</h3>
              <div className="flex flex-row gap-4">
                {social.map((item) => {
                  return (
                    <div key={item.title}>
                      {item.icon}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer };
