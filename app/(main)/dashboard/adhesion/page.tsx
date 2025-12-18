import { getActiveSeasonData } from "@/src/features/admin/season/dal";
import { getUserMembershipForActiveSeason } from "@/src/features/membership/dal";
import { getProfile } from "@/src/features/account/dal";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import UserMembershipDashboard from "@/src/features/membership/components/public/UserMembershipDashboard";

export default async function AdhesionPage() {
  
  // 1. Data Fetching (Server Side)
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  // On lance les requêtes en parallèle pour la performance
  const [user, season, membership] = await Promise.all([
    getProfile(session.userId),
    getActiveSeasonData(),
    getUserMembershipForActiveSeason(session.userId)
  ]);

  // 2. Render Feature Component
  return (
        <UserMembershipDashboard 
            user={user} 
            season={season} 
            membership={membership} 
        />
  );
}