import PageContentMembers from "@/components/common/PageContentMembers";
import UserList from "@/src/features/users/member/annuaire/UserList";

export default function annuaire() {
    return (
        <PageContentMembers
            title="Annuaire des membres"
            pageContent={<UserList/>}
        />
    );
}