"use client"

import { useState } from "react";
import { PublicUserList, PublicUserDetails } from "@/src/lib/dto";
import { Search, Mail, Phone, ChevronRight } from "lucide-react";
import { getAssetUrl } from "@/src/lib/utils";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getUserDetailsAction } from "../../user.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-slate-100 rounded-md">
                                <AvatarImage src={getAssetUrl(user.profileImageUrl)} className="object-cover" />
                                <AvatarFallback className="bg-slate-50 text-slate-500 font-bold uppercase text-xs rounded-md">
                                    {user.name[0]}{user.lastname[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-slate-900 uppercase text-sm tracking-tight">
                                    {user.lastname} <span className="text-primary">{user.name}</span>
                                </h3>
                            </div>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button 
                                    onClick={() => handleSeeMore(user.id)}
                                    className="p-2 hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-md">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-black uppercase text-primary border-b pb-2">Profil</DialogTitle>
                                </DialogHeader>

                                {isLoading ? (
                                    <div className="py-8 text-center font-bold text-slate-400 animate-pulse">Chargement...</div>
                                ) : selectedUser && (
                                    <div className="space-y-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-14 w-14 border border-slate-200 rounded-md">
                                                <AvatarImage src={getAssetUrl(selectedUser.profileImageUrl)} className="object-cover" />
                                                <AvatarFallback className="bg-slate-50 text-slate-500 text-lg font-bold uppercase rounded-md">
                                                    {selectedUser.name[0]}{selectedUser.lastname[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-lg font-black uppercase text-slate-900 leading-none">
                                                    {selectedUser.lastname} {selectedUser.name}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 uppercase">Inscrit le {selectedUser.createdAt}</p>
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
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold italic uppercase text-xs">Aucun membre trouvé</p>
            )}
        </div>
    );
}
