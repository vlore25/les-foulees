import { getCurrentUser } from "@/src/features/users/dal";
import { TabsContent } from "@/components/ui/tabs";

// Imaginons que vous ayez extrait vos tableaux/listes dans des composants séparés
// import UsersList from "@/src/features/admin/UsersList";
// import EventsList from "@/src/features/admin/EventsList";

export default async function AdminDashboardPage() {
  // 1. Récupération des données côté serveur (Server Component)
  const user = await getCurrentUser();
  const name = user?.name || "Administrateur"; 

  // 2. On retourne directement les TabsContent.
  // Ils s'afficheront automatiquement selon l'onglet cliqué dans le Layout.
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* === CONTENU ONGLET MEMBRES === */}
      <TabsContent value="users" className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Bonjour, {name} 👋</h1>
          <p className="text-muted-foreground">Voici la liste des membres.</p>
          
          {/* Insérez votre composant de liste ici */}
          {/* <UsersList /> */}
          <div className="border border-dashed p-10 rounded-lg">Composant UsersList ici</div>
        </div>
      </TabsContent>

      {/* === CONTENU ONGLET ÉVÉNEMENTS === */}
      <TabsContent value="events" className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Événements</h1>
          
          {/* Insérez votre composant d'événements ici */}
          {/* <EventsList /> */}
          <div className="border border-dashed p-10 rounded-lg">Composant EventsList ici</div>
        </div>
      </TabsContent>

      {/* === CONTENU ONGLET DOCS === */}
      <TabsContent value="docs" className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0">
         <h1 className="text-2xl font-bold tracking-tight mb-4">Documents</h1>
         <div className="p-10 border border-dashed rounded-lg text-center text-muted-foreground">
           Module Documents à venir...
         </div>
      </TabsContent>

    </div>
  );
}