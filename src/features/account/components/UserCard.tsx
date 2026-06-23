// components/user-card.tsx
"use client";

import { useUser } from "@/components/providers/UserProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import LogoutButton from "../../auth/components/buttons/LogoutButton";
import { getAssetUrl } from "@/src/lib/utils";
import { UserName } from "@/components/ui/user-name";


export default function UserCard() {

    const user = useUser();
    if (!user) return null;
    const getInitials = (name: string, lastname: string) => {
        const firstInitial = Array.from(name || '')[0] || '';
        const lastInitial = Array.from(lastname || '')[0] || '';
        return (firstInitial + lastInitial).toUpperCase();
    };

    const initials = getInitials(user.name || "", user.lastname || "");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex gap-2.5 items-center hover:cursor-pointer">
                    <Avatar >
                        <AvatarImage src={user.profileImageUrl ? getAssetUrl(user.profileImageUrl) : undefined} className="object-cover" />
                        <AvatarFallback className='bg-primary/10'>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start overflow-hidden">
                        <div className="flex whitespace-nowrap truncate w-full text-sm text-foreground">
                            <UserName name={user.name} lastname={user.lastname} />
                        </div>
                        <p className="text-xs lowercase">{user.email}</p>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <LogoutButton />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

    );
}