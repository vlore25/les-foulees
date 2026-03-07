
type NavItem = {
  title: string;
  href: string;
  subItems?: NavItem[]; 
};

const navItems: NavItem[]= [
        {
            title: "Actualités",
            href: "/actualitées",
            subItems: [
            {
                title: "Blog",
                href: "/blog",
            },
            {
                title: "Galerie",
                href: "/galerie",
            },
        ]
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