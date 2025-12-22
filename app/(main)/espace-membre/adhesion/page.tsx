import { getActiveSeasonData } from "@/src/features/season/dal";
import { getUserMembershipForActiveSeason } from "@/src/features/membership/dal";
import { getProfile } from "@/src/features/account/dal";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";
import UserMembershipDashboard from "@/src/features/membership/public/UserMembershipDashboard";

export default async function AdhesionPage() {
  
  const session = await getSession();
  if (!session?.userId) redirect("/login");


  const [user, season, membership] = await Promise.all([
    getProfile(session.userId),
    getActiveSeasonData(),
    getUserMembershipForActiveSeason(session.userId)
  ]);

  return (
        <UserMembershipDashboard 
            user={user} 
            season={season} 
            membership={membership} 
        />
  );
}