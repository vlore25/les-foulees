import { getAllUsers } from "../dal";
import { UserTable } from "./UserTable";
import { columnsUsers } from "./ColumnsUsers";


export default async function UsersList() {
    const activeUsers = await getAllUsers();
    console.log(activeUsers[0])
    return (
        <UserTable data= {activeUsers} columns={columnsUsers} />
    );
}