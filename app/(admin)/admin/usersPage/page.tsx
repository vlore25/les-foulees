

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { getAllUsers } from "@/lib/dal";


export default async function UserGestion() {
    const activeUsers = await getAllUsers();
    const userCard = activeUsers.map((user) => {
        return (
            <div key={user.id}>
                <div>
                    <h3>{user.name}{' '}{user.lastname}</h3>
                    <p className="text-mutted">{user.email}</p>
                    <p>{user.status == 'ACTIVE' ?
                        <Badge variant={'active'}><span>Active</span></Badge> : <Badge variant={'inactive'}><span>Inactif</span></Badge>
                    }</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Open</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                    <DropdownMenuShortcut>B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Keyboard shortcuts
                                    <DropdownMenuShortcut>K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>Email</DropdownMenuItem>
                                            <DropdownMenuItem>Message</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>More...</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    New Team
                                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuItem disabled>API</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                                <DropdownMenuShortcut>Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
            </div>
        );
    })
    return (
        <div>
            <p>Gestion de membres</p>
            {userCard}
        </div>
    );
}