import { AdminUserDTO } from "@/src/lib/dto";
import { UserTable } from "../../components/UserTable";
import { getAllUsers } from "../../dal";
import { columnsUsersAdmin } from "./ColumnsUsersAdmin";

export default async function AdminUsersTable(){
    const usersData = await getAllUsers() as AdminUserDTO[];

    return (
    <UserTable data= {usersData} columns={columnsUsersAdmin}/>
    );
}