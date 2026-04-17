
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
            href: "/about",
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
        href: "/plan-du-site"
    },
    {
        title: "Mentions légales",
        href: "/mentions-legales"
    },
    {
        title: "Politique de confidentialité",
        href: "/politique-de-confidentialite"
    },
]

type NavItemFooter2 = {
  title: string;
  href: string;
};

export const navItemsFooter2: NavItemFooter[] =[
    {
        title: "Copyright © 2026 Les Foulées Avrillaises",
        href: "/"
    },
    {
        title: "Victor Loré.",
        href: "https://victorlore.fr"
    },
]