import UsersList from "@/src/features/users/components/UsersList";
import EventList from "@/src/features/events/components/admin/EventList";
import AdminDashboard from "@/src/features/admin/AdminDashboard";
import LegalDocsList from "@/src/features/docs/components/admin/LegalDocsList";
import MembershipsList from "@/src/features/membership/components/admin/MembershipsList";
import SeasonsManager from "@/src/features/admin/season/components/SeasonManager";

interface PageProps {
  // On change le type pour accepter n'importe quel paramètre (tab, seasonId, etc.)
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  // On attend la résolution des paramètres
  const params = await searchParams;
  
  // On sécurise la récupération du tab
  const currentTab = typeof params.tab === 'string' ? params.tab : "users";

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto">
      <AdminDashboard
        currentTab={currentTab}
        usersListNode={<UsersList />}
        eventsListNode={<EventList />}
        legalDocsListNode={<LegalDocsList/>}
        seasonsListNode={<SeasonsManager />}
        
        membershipListNode={<MembershipsList searchParams={searchParams as any} />} 
      />
    </div>
  );
}