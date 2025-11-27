import { Calendar, CalendarCheck, CalendarCheck2, CalendarSearch, Files, LogOut, UserSquare } from "lucide-react";
import { ReactNode } from "react";

type UserNavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  subItems?: UserNavItem[]; 
};

const UserNavItems: UserNavItem[]= [
        {
            title: "Information personel",
            href: "/dashboard/profile",
            icon: <UserSquare/>
        },
        {
            title: "Evenements",
            href: "/events",
            icon: <Calendar/>,
            subItems: [
            {
                title: "Evenements ou je suis inscrit",
                href: "/evenements/participation",
                icon: <CalendarCheck2/>
            },
            {
                title: "Voir tous les evenements",
                href: "/events",
                icon: <CalendarSearch/>
            },
        ]
        },
        {
            title: "Documents du club",
            href: "/documents",
            icon: <Files/>
        },
    ]
export default UserNavItems;