import UsersTableDesktop from "./UsersTableDesktop";
import { getAllUsers } from "../../dal";
import UsersCardsMobile from "./UsersCardMobile";


export default async function UsersList() {

    const activeUsers = await getAllUsers();
    return (
        <div>
            <UsersTableDesktop data={activeUsers}/>
            <UsersCardsMobile users={activeUsers}/>
        </div>
    );
}