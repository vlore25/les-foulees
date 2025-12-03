"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FileText, Menu, BrickWallShield } from "lucide-react";
import { ReactNode } from "react";

interface AdminViewProps {
  usersContent: ReactNode;
  eventsContent: ReactNode;
}

export default function AdminView({ usersContent, eventsContent }: AdminViewProps) {
  // Optionnel : pour fermer le menu mobile quand on clique sur un onglet
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // On définit la liste des onglets une fois pour la réutiliser
  const TabItems = () => (
    <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2 items-stretch text-foreground">
      <TabsTrigger 
        value="users" 
        onClick={() => setIsMobileOpen(false)} // Ferme le menu mobile au clic
        className="justify-start gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
      >
        <Users className="h-4 w-4" />
        Membres
      </TabsTrigger>

      <TabsTrigger 
        value="events" 
        onClick={() => setIsMobileOpen(false)}
        className="justify-start gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
      >
        <Calendar className="h-4 w-4" />
        Événements
      </TabsTrigger>

      <TabsTrigger 
        value="docs" 
        onClick={() => setIsMobileOpen(false)}
        className="justify-start gap-2 px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
      >
        <FileText className="h-4 w-4" />
        Documents
      </TabsTrigger>
    </TabsList>
  );

  return (
    <Tabs defaultValue="users" orientation="vertical" className="flex flex-col md:flex-row h-screen w-full">
      
      {/* === 1. HEADER MOBILE (Visible uniquement sur mobile "md:hidden") === */}
      <div className="md:hidden flex items-center p-4 border-b bg-muted/20">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="flex items-center gap-2">
                <BrickWallShield className="h-6 w-6" />
                Administration
              </SheetTitle>
            </SheetHeader>
            {/* On insère les onglets dans le menu mobile */}
            <TabItems />
          </SheetContent>
        </Sheet>
        <h1 className="ml-4 font-bold text-lg">Admin Dashboard</h1>
      </div>

      {/* === 2. SIDEBAR DESKTOP (Cachée sur mobile "hidden md:flex") === */}
      <aside className="hidden md:flex w-64 border-r bg-muted/30 p-6 flex-col gap-4">
        <div className="flex items-center gap-2 px-2 mb-4">
            <BrickWallShield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Admin</h2>
        </div>
        {/* On insère les mêmes onglets dans la sidebar */}
        <TabItems />
      </aside>

      {/* === 3. CONTENU PRINCIPAL (Commun) === */}
      <main className="flex-1 p-4 md:p-8 bg-background overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            {/* Le contenu change automatiquement grâce à TabsContent */}
            
            <TabsContent value="users" className="mt-0 border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Gestion des Membres</h1>
              </div>
              {usersContent}
            </TabsContent>

            <TabsContent value="events" className="mt-0 border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold mb-6">Gestion des Événements</h1>
              {eventsContent}
            </TabsContent>

            <TabsContent value="docs" className="mt-0 border-none animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h1 className="text-2xl font-bold mb-6">Documents du Club</h1>
               <div className="p-10 border border-dashed rounded-lg text-center text-muted-foreground">
                  Module Documents à venir...
               </div>
            </TabsContent>
        </div>
      </main>

    </Tabs>
  );
}