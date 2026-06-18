import { getAllInvitations } from "../dal";
import AdminInvitesListClient from "./AdminInvitesListClient";

export default async function AdminInvitesList() {
  const invitationsData = await getAllInvitations();

  return (
    <div className="w-full">
      <AdminInvitesListClient invitations={invitationsData} />
    </div>
  );
}
