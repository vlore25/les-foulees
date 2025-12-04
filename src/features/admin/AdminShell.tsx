"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FileText, Menu, BrickWallShield } from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Liste des onglets
  const TabItems = () => (
    <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2 text-foreground">
      <TabsTrigger 
        value="users" 
        onClick={() => setIsMobileOpen(false)}
        className="justify-start gap-2 px-4 w-full py-3 data-[state=active]:bg-primary/15 data-[state=active]:text-primary-foreground transition-all"
      >
        <Users className="h-4 w-4" />
        <p>Membres</p>
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
    <Tabs defaultValue="users" orientation="vertical" className="flex flex-col md:flex-row h-screen w-full bg-background">
      {/* === HEADER MOBILE === */}
      <div className="md:hidden flex items-center p-4 border-b bg-muted/20 shrink-0">
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
            <TabItems />
          </SheetContent>
        </Sheet>
        <h1 className="ml-4  text-lg">Admin Dashboard</h1>
      </div>

      {/* === SIDEBAR DESKTOP === */}
      <aside className="hidden md:flex w-64 border-r bg-muted/30 p-6 flex-col gap-4 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-4">
            <BrickWallShield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Tableau de bord</h2>
        </div>
        <TabItems />
      </aside>
      <main className="flex-1 overflow-y-auto mx-1">
        {children}
      </main>
    </Tabs>
  );
}