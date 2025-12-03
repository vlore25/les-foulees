import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllUsers } from "./dal";

 
export default async function UsersList(){

 const activeUsers = await getAllUsers();
    const userCard = activeUsers.map((user) => {
        return (
            <div key={user.id}>
                <div>
                    <h3>{user.name}{' '}{user.lastname}</h3>
                    <p className="text-mutted">{user.email}</p>
                    <p className="text-mutted">{user.role}</p>
                    <p>{user.status == 'ACTIVE' ?
                        <Badge variant={'active'}><span>Active</span></Badge> : <Badge variant={'inactive'}><span>Inactif</span></Badge>
                    }</p>
                </div>
                <Separator />
            </div>
        );
    })
    return (
        <div>
            {userCard}
        </div>
    );
 }