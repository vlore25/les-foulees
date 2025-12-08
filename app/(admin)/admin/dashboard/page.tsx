
import UsersList from "@/src/features/users/components/users-gestion/UsersList";
import EventList from "@/src/features/events/components/admin/EventList";
import AdminDashboard from "@/src/features/admin/AdminDashboard";
import LegalDocsList from "@/src/features/docs/components/admin/LegalDocsList";

interface PageProps {
  searchParams: { tab?: string };
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  // Attendre les params (Next.js 15)
  const params = await searchParams;
  const currentTab = params?.tab || "users";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <AdminDashboard
        currentTab={currentTab} 
        usersListNode={<UsersList />}
        eventsListNode={<EventList />}
        legalDocsListNode={<LegalDocsList/>}
      />
    </div>
  );
}