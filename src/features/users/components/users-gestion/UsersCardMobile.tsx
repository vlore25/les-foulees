import { UserDTO } from "@/src/lib/dto";
import { UserRowActions } from "./UserRowActions";
import { UserStatusBadge } from "./UserStatusBadge";

interface UserProps {
    users: UserDTO[];
}

export default function UsersCardsMobile({ users }: UserProps) {

    return (
        <div className="flex flex-col gap-1 lg:hidden">
            {users.map((user) => {
                const email = "email" in user ? user.email : null;
                return (
                    <div className="flex shadow-sm rounded-b-sm justify-between p-2" key={user.id}>
                        <div className="flex-col gap-2">
                            <div className="flex gap-2">
                                <p>{user.name}</p>
                                <p>{user.lastname}</p>
                            </div>
                            <p className="text-sm text-foreground">{email}</p>
                            <UserStatusBadge status={user.status} />
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
