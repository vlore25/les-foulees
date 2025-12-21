import { BookUser, Calendar, Calendars, ClipboardClock, FileText, LucideIcon, PersonStanding, Users, UserSquare, UserStar } from "lucide-react"

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;      
  items: NavItem[];
  adminOnly?: boolean;
}

// Admin Navigation
export const ItemsNavAdmin: NavSection[] = [
  {
    label: "Administration",
    items: [
      { title: "Utilisateurs", url: "/admin/utilisateurs", icon: Users },
      { title: "Événements", url: "/admin/evenements", icon: Calendar },
      { title: "Documents", url: "/admin/documents", icon: FileText },
      { title: "Saisons", url: "/admin/seasons", icon: ClipboardClock },
      { title: "Adherants", url: "/admin/adherants", icon: BookUser },
    ]
  },
  {
    label: "Navigation",
    items: [
      {title: "Espace membres", url: "/espace-membre", icon: PersonStanding}
    ]
  }
]

// User Navigation
export const ItemsNavUser: NavSection[] = [
  {
    label: "Association",
    items: [
      { title: "Annuaire des membres", url: "/espace-membre/annuaire", icon: Users },
      { title: "Événements", url: "/espace-membre/evenements", icon: Calendar },
      { title: "Documents", url: "/espace-membre/documents", icon: FileText },
    ]
  },
  {
    label: "Personnel",
    items: [
      { title: "Compte", url: "/espace-membre/compte", icon: UserSquare },
      { title: "Adhésion", url: "/espace-membre/adhesion", icon: BookUser },
    ]
  },
  {
    label: "Administration",
    adminOnly: true,
    items: [
      { title: "Espace administration", url: "/admin", icon: UserStar},
    ]
  }
]