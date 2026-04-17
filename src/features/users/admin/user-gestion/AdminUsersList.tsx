import { getAllUsersAdminList } from "../../dal";
import AdminUsersListClient from "./AdminUsersListClient";

export default async function AdminUsersList() {
  // Récupération des données via la DAL
  const usersData = await getAllUsersAdminList();

  return (
    <div className="w-full">
      <AdminUsersListClient users={usersData} />
    </div>
  );
}