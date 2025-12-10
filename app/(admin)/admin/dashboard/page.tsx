import UsersList from "@/src/features/users/components/users-gestion/UsersList";
import EventList from "@/src/features/events/components/admin/EventList";
import AdminDashboard from "@/src/features/admin/AdminDashboard";
import LegalDocsList from "@/src/features/docs/components/admin/LegalDocsList";
import SeasonsList from "@/src/features/admin/season/components/SeasonsList";

interface PageProps {
  searchParams: Promise<{ tab?: string }>; // Mise à jour pour Next.js 15 (Promise)
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentTab = params?.tab || "users";

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto">
      <AdminDashboard
        currentTab={currentTab}
        usersListNode={<UsersList />}
        eventsListNode={<EventList />}
        legalDocsListNode={<LegalDocsList/>}
        seasonsListNode={<SeasonsList />} 
      />
    </div>
  );
}