import { TabsContent } from "@/components/ui/tabs";
import UsersList from "@/src/features/users/components/users-gestion/UsersList";
import UsersTabManager from "../../../../src/features/admin/dashboard-tabs/UsersTabManager";
import EventsTabManager from "@/src/features/admin/dashboard-tabs/EventsTabsManager";
import { getCurrentUser } from "@/src/features/users/dal";
import EventList from "@/src/features/events/components/admin/EventList";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const name = user?.name || "Administrateur"; 
  return (
    <div className="md:p-8 max-w-7xl mx-auto space-y-6">
      {/* === CONTENU ONGLET MEMBRES === */}
      <TabsContent value="users" className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0">
        <div className="flex flex-col gap-4">
          <h3>Gestion des membres.</h3>
          <UsersTabManager>
             <UsersList /> 
          </UsersTabManager>
        </div>
      </TabsContent>

      {/* === CONTENU ONGLET ÉVÉNEMENTS === */}
      <TabsContent value="events" className="m-0 focus-visible:ring-0 focus-visible:ring-offset-0">
        <div className="flex flex-col gap-4">
          <h3>Gestion des Evenements.</h3>
          <EventsTabManager>
            <EventList/>
          </EventsTabManager>
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