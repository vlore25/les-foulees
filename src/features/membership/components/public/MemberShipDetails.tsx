import { getSession } from "@/src/lib/session";
import { getUserMembershipForActiveSeason } from "../../dal";
import { Button } from "@/components/ui/button";
import { getSeasonsData } from "@/src/features/admin/season/dal";

export default async function Membershipdetails(){
    const user = await getSession();

    const userMembership = await getUserMembershipForActiveSeason(user.userId);
    const seasons = await getSeasonsData();
    

    console.log(activeSeason)
    if(!userMembership){
        return(
            <Button>Demande de Adhesion</Button>
        );
    }
    return(
        <div>User memberShip</div>

    );
}