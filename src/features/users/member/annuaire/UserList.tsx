import { getAllUsersPublicList } from "../../dal";
import UserListClient from "./UserListClient";

export default async function UserList() {
  const users = await getAllUsersPublicList();

  return (
    <div className="w-full">
       <UserListClient initialUsers={users} />
    </div>
  );
}