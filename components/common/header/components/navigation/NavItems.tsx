
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
            title: "À Propos",
            href: "/apropos",
        },
        {
            title: "Nous contacter",
            href: "/contact",
        },
        {
            title: "Envenements",
            href: "/evenements",
        }
    ]

export default navItems;