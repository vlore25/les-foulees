import { getAllUsers } from "../dal";
import { UserTable } from "./UserTable";
import { columnsUsers } from "./ColumnsUsers";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";


export default async function UsersList() {
    const activeUsers = await getAllUsers();
    return (
        <div>
            <UserTable data={activeUsers} columns={columnsUsers} />
        </div>

    );
}