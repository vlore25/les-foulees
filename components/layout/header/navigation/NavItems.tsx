
type NavItem = {
  title: string;
  href: string;
  subItems?: NavItem[]; 
};

const navItems: NavItem[]= [
        {
            title: "Accueil",
            href: "/",
        },
        {
            title: "Évènements",
            href: "/evenements",
        },
        {
            title: "À Propos",
            href: "/apropos",
        },
        {
            title: "Nous contacter",
            href: "/contact",
        }
        
    ]

export default navItems;

type NavItemFooter = {
  title: string;
  href: string;
};

export const navItemsFooter: NavItemFooter[] =[
    {
        title: "Plan du site",
        href: "#"
    },
    {
        title: "Mentions légales",
        href: "#"
    },
    {
        title: "Politique de confidentialité",
        href: "#"
    },
]

type NavItemFooter2 = {
  title: string;
  href: string;
};

export const navItemsFooter2: NavItemFooter[] =[
    {
        title: "Copyright © 2027 Les Foulées Avrillaises",
        href: "#"
    },
    {
        title: "Réalisation du site par Victor Loré.",
        href: "victorlore.fr"
    },
]