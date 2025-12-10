import { Calendar, CalendarCheck, CalendarCheck2, CalendarSearch, Files, LogOut, Users, UserSquare } from "lucide-react";
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
            href: "/dashboard/account",
            icon: <UserSquare/>
        },
        {
            title: "Evenements",
            href: "/dashboard/evenements",
            icon: <Calendar/>,
        },
        {
            title: "Annuaire de membres",
            href: "/dashboard/annuaire",
            icon: <Users/>
        },
        {
            title: "Documents du club",
            href: "/documents",
            icon: <Files/>
        },
    ]
export default UserNavItems;