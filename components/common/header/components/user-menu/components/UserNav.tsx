

type UserNavItem = {
  title: string;
  href: string;
  subItems?: UserNavItem[]; 
};

const navItems: UserNavItem[]= [
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

export default function UserNav(){

}