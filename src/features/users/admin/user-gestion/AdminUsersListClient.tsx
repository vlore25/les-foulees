"use client"

import { useState } from "react";
import { AdminUserList } from "@/src/lib/dto";
import { Search, Eye, Calendar } from "lucide-react";
import { cn, getAssetUrl } from "@/src/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserRowActions } from "./UserRowActions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserName } from "@/components/ui/user-name";

export default function AdminUsersListClient({ users }: { users: AdminUserList[] }) {
    const [search, setSearch] = useState("");

    const filteredUsers = users.filter(user => 
        (`${user.name} ${user.lastname}`.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Rechercher un utilisateur..." 
                    className="pl-10 h-10 bg-white rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-md">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-slate-100">
                                <AvatarImage src={getAssetUrl(user.profileImageUrl)} className="object-cover" />
                                <AvatarFallback className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                    {user.name[0]}{user.lastname[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-slate-900 text-sm flex items-center gap-2">
                                    <UserName name={user.name} lastname={user.lastname} />
                                    <Badge className={cn(
                                        "border-none text-[8px] font-black uppercase px-2 py-0 h-4 rounded-sm",
                                        user.status === "ACTIVE" 
                                            ? "bg-green-100 text-green-700" 
                                            : "bg-red-100 text-red-700"
                                    )}>
                                        {user.status === "ACTIVE" ? "Actif" : "Inactif"}
                                    </Badge>
                                    {user.role === "ADMIN" && (
                                        <Badge className="border-none text-[8px] font-black uppercase px-2 py-0 h-4 rounded-sm bg-purple-100 text-purple-700">
                                            Admin
                                        </Badge>
                                    )}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 mt-0.5">
                                    <Calendar size={12} className="text-primary/50" />
                                    <span>Depuis {user.createdAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-400 hover:text-primary hover:bg-slate-100">
                                <Link href={`/admin/utilisateurs/${user.id}`}>
                                    <Eye size={16} />
                                </Link>
                            </Button>
                            <UserRowActions userId={user.id} role={user.role} />
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold italic uppercase text-xs">Aucun utilisateur trouvé</p>
            )}
        </div>
    );
}
