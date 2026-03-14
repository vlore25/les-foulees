import { UserTable } from "../../components/UserTable";
import { columnsUsersAdmin } from "./ColumnsUsersAdmin";
import { getAllUsersAdminList } from "../../dal";

export default async function AdminUsersTable(){

    const usersData = await getAllUsersAdminList();

    return (
    <UserTable data= {usersData} columns={columnsUsersAdmin}/>
    );
}