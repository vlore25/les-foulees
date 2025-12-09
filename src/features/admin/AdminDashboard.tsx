"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import UsersTabManager from "@/src/features/admin/dashboard-tabs/UsersTabManager";
import EventsTabManager from "@/src/features/admin/dashboard-tabs/EventsTabsManager";
import LegalDocsTabManager from "./dashboard-tabs/DocsTabsManager";
import SeasonsTabsManager from "./dashboard-tabs/SeasonsTabsManager";

import { BrickWallShield, Users, Calendar, FileText, ClipboardClock } from "lucide-react";

interface AdminDashboardProps {
  currentTab: string;
  usersListNode: React.ReactNode;
  eventsListNode: React.ReactNode;
  legalDocsListNode: React.ReactNode;
  seasonsListNode: React.ReactNode;
}

export default function AdminDashboard({ currentTab, usersListNode, eventsListNode, legalDocsListNode,  seasonsListNode}: AdminDashboardProps) {
  const router = useRouter();

  const tabsItems = [
    { value: "users", label: "Membres", icon: <Users className="h-4 w-4 mr-2" /> },
    { value: "events", label: "Événements", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: "docs", label: "Documents", icon: <FileText className="h-4 w-4 mr-2" /> },
    { value: "season", label: "Seasons", icon: <ClipboardClock className="h-4 w-4 mr-2" /> },
  ];

  const handleTabChange = (value: string) => {
    router.push(`/admin/dashboard?tab=${value}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
                <BrickWallShield className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="sm:hidden w-full">
          <Select value={currentTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un module" />
            </SelectTrigger>
            <SelectContent>
              {tabsItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="hidden sm:flex justify-start w-auto">
          {tabsItems.map((item) => (
             <TabsTrigger key={item.value} value={item.value} className="gap-2">
                {item.icon}
                {item.label}
             </TabsTrigger>
          ))}
        </TabsList>

        {/* === CONTENU MEMBRES === */}
        <TabsContent value="users" className="space-y-4 m-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Gestion des membres</h3>
            </div>
            <UsersTabManager>
               {usersListNode} 
            </UsersTabManager>
          </div>
        </TabsContent>

        {/* === CONTENU ÉVÉNEMENTS === */}
        <TabsContent value="events" className="space-y-4 m-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Gestion des Événements</h3>
            </div>
            <EventsTabManager>
              {eventsListNode}
            </EventsTabManager>
          </div>
        </TabsContent>

        {/* === CONTENU DOCUMENTS === */}
        <TabsContent value="docs" className="space-y-4 m-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Documents administratifs</h3>
            </div>
            <LegalDocsTabManager>
              {legalDocsListNode}
           </LegalDocsTabManager>
          </div>
           
        </TabsContent>
        {/* === CONTENU SEASONS === */}
        <TabsContent value="season" className="space-y-4 m-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Seasons</h3>
            </div>
            <SeasonsTabsManager>
              {seasonsListNode}
           </SeasonsTabsManager>
          </div>
           
        </TabsContent>
      </Tabs>
    </div>
  );
}