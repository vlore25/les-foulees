import { Calendar, CalendarCheck, CalendarCheck2, CalendarCog, CalendarPlus, CalendarSearch, FileInput, FilePlus, Files, FileStack, LogOut, Newspaper, UserCog, UserPlus, Users, UserSquare } from "lucide-react";
import { ReactNode } from "react";

type AdminNavItem = {
    title: string;
    href: string;
    icon: ReactNode;
    subItems?: AdminNavItem[];
};

const AdminNavItems: AdminNavItem[] = [
    {
        title: "Membres",
        href: "/admin/dashboard/users",
        icon: <Users />,
        subItems: [
            {
                title: "Gestion des membres",
                href: "/admin/users/",
                icon: <UserCog />
            },
            {
                title: "Inviter un nouveau membre",
                href: "/admin/dashboard/users/invitation",
                icon: <UserPlus />
            },
        ]

    },
    {
        title: "Evenements",
        href: "/events",
        icon: <Calendar />,
        subItems: [
            {
                title: "Evenements",
                href: "/evenements/",
                icon: <CalendarCog />
            },
            {
                title: "Ajouter un nouveau evenement",
                href: "/evenement/nouveau",
                icon: <CalendarPlus />
            },
        ]
    },
    {
        title: "Documents du club",
        href: "/documents",
        icon: <FileStack />,
        subItems: [
            {
                title: "Ajouter un nouveau document",
                href: "/documents/nouveau",
                icon: <FilePlus />
            },
        ]
    },
    {
        title: "Articles et blog",
        href: "/",
        icon: <Newspaper />,
        subItems: [
            {
                title: "Ajouter un nouveau article",
                href: "/documents/nouveau",
                icon: <FileInput />
            },
        ]
    },
]
export default AdminNavItems;