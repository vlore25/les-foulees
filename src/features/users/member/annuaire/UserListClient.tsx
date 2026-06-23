"use client"

import { useState } from "react";
import { PublicUserList, PublicUserDetails } from "@/src/lib/dto";
import { Search, Mail, Phone, ChevronRight } from "lucide-react";
import { getAssetUrl } from "@/src/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserDetailsAction } from "../../user.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserName } from "@/components/ui/user-name";
import { TypographyH3, TypographyDetail } from "@/components/ui/typography";

export default function UserListClient({ initialUsers }: { initialUsers: PublicUserList[] }) {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<PublicUserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const filteredUsers = initialUsers.filter(user => 
        user.status === "ACTIVE" && 
        (`${user.name} ${user.lastname}`.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSeeMore = async (id: string) => {
        setIsLoading(true);
        const details = await getUserDetailsAction(id);
        setSelectedUser(details);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Rechercher un membre..." 
                    className="pl-10 h-10 bg-white border-slate-200 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-md">
                {filteredUsers.map((user) => (
                    <Dialog key={user.id}>
                        <DialogTrigger asChild>
                            <div
                                onClick={() => handleSeeMore(user.id)}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border border-slate-100">
                                        <AvatarImage src={user.profileImageUrl ? getAssetUrl(user.profileImageUrl) : undefined} className="object-cover" />
                                        <AvatarFallback className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                                            {user.name[0]}{user.lastname[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-slate-900 text-sm tracking-tight">
                                            <UserName name={user.name} lastname={user.lastname} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2 text-slate-400 group-hover:text-primary transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-md">
                            <DialogHeader>
                                <DialogTitle asChild>
                                    <TypographyH3 className="text-primary border-b pb-2">Profil</TypographyH3>
                                </DialogTitle>
                            </DialogHeader>

                            {isLoading ? (
                                <div className="py-8 text-center font-bold text-slate-400 animate-pulse">Chargement...</div>
                            ) : selectedUser && (
                                <div className="space-y-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border border-slate-200">
                                            <AvatarImage src={selectedUser.profileImageUrl ? getAssetUrl(selectedUser.profileImageUrl) : undefined} className="object-cover" />
                                            <AvatarFallback className="bg-slate-50 text-slate-500 text-lg font-bold uppercase">
                                                {selectedUser.name[0]}{selectedUser.lastname[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-slate-900 text-lg leading-none">
                                                <UserName name={selectedUser.name} lastname={selectedUser.lastname} />
                                            </div>
                                            <TypographyDetail className="block mt-2">Inscrit le {selectedUser.createdAt}</TypographyDetail>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                                            <Mail className="text-primary h-4 w-4" />
                                            <span className="font-bold text-slate-700">{selectedUser.email || "Non partagé"}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                                            <Phone className="text-primary h-4 w-4" />
                                            <span className="font-bold text-slate-700">{selectedUser.phone || "Non partagé"}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold text-xs">Aucun membre trouvé</p>
            )}
        </div>
    );
}
