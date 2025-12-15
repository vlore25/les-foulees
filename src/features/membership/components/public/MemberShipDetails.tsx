import { getSession } from "@/src/lib/session";
import { getUserMembershipForActiveSeason } from "../../dal";
import { Button } from "@/components/ui/button";
import { getActiveSeasonData } from "@/src/features/admin/season/dal";

export default async function Membershipdetails() {
    const user = await getSession();

    const userMembership = await getUserMembershipForActiveSeason(user.userId);

    const season = await getActiveSeasonData();

    console.log(season)
    if (!userMembership) {
        return (
            <div>
                <p>L'inscriptions pour la season {season?.name} sont ouvertes!</p>
                <Button>Demande de Adhesion</Button>
            </div>

        );
    }
    return (

        <div>User memberShip</div>

    );
}