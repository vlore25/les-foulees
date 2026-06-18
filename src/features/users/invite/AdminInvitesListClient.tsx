"use client"

import { useState, useTransition } from "react";
import { Search, Calendar, UserPlus, Send, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Invitation } from "@prisma/client";
import { resendInviteAction } from "../user.action";
import { toast } from "sonner";

function CopyLinkButton({ token }: { token: string }) {
    const handleCopy = () => {
        const url = `${window.location.origin}/inscription?token=${token}`;
        navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papiers");
    };

    return (
        <Button variant="outline" size="icon" onClick={handleCopy} className="h-8 w-8 text-slate-500 hover:text-primary" title="Copier le lien d'invitation">
            <Copy size={14} />
        </Button>
    );
}

function ResendButton({ email }: { email: string }) {
    const [isPending, startTransition] = useTransition();

    const handleResend = () => {
        startTransition(async () => {
            const res = await resendInviteAction(email);
            if (res?.success) {
                toast.success(res.message);
            } else {
                toast.error(res?.message || "Erreur lors du renvoi");
            }
        });
    };

    return (
        <Button variant="outline" size="sm" onClick={handleResend} disabled={isPending} className="h-8">
            <Send size={14} className="mr-2" />
            {isPending ? 'Envoi...' : 'Renvoyer'}
        </Button>
    );
}

export default function AdminInvitesListClient({ invitations }: { invitations: Invitation[] }) {
    const [search, setSearch] = useState("");

    const filteredInvites = invitations.filter(invite => 
        (invite.email.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Rechercher une invitation..." 
                        className="pl-10 h-10 bg-white border-slate-200 rounded-md"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button asChild className="ml-4 rounded-md">
                    <Link href="/admin/utilisateurs/inviter">
                        <UserPlus size={16} className="mr-2" />
                        Nouveau membre
                    </Link>
                </Button>
            </div>

            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-md">
                {filteredInvites.map((invite) => (
                    <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                                    {invite.email}
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    <Calendar size={12} className="text-primary/50" />
                                    <span>Créée le {new Date(invite.createdAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CopyLinkButton token={invite.token} />
                            <ResendButton email={invite.email} />
                        </div>
                    </div>
                ))}
            </div>

            {filteredInvites.length === 0 && (
                <p className="text-center py-10 text-slate-400 font-bold italic uppercase text-xs">Aucune invitation trouvée</p>
            )}
        </div>
    );
}
