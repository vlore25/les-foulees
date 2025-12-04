import { Badge } from "lucide-react";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserProps {
    users: any;
}

export default function UsersCardsMobile({ users }: UserProps) {
 
    return (
        <div className="flex flex-col gap-1 lg:hidden">
            {users.map((user: any) => {
                return (
                    <div className="flex shadow-sm rounded-b-sm justify-between p-2" key={user.id}>
                        <div className="flex-col gap-2">
                            <div className="flex gap-2">
                                <p>{user.name}</p>
                                <p>{user.lastname}</p>
                            </div>
                            <p className="text-sm text-foreground">{user.email}</p>
                            <UserStatusBadge status={user.status}/>
                        </div>
                        <div>
                            <UserRowActions userId={user.id} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
