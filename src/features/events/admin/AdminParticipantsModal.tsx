// src/features/events/admin/AdminParticipantsModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";
import ExportEventButton from "./ExportEventButton";
import { fetchEventParticipantsAction } from "../events.actions";
import { TypographyDetail } from "@/components/ui/typography";
import { UserName } from "@/components/ui/user-name";

interface AdminModalProps {
    eventId: string;
    eventTitle: string;
    participantCount: number;
}

export default function AdminParticipantsModal({ eventId, eventTitle, participantCount }: AdminModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registrations, setRegistrations] = useState<any[]>([]); 

    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);
        if (open && participantCount > 0) {
            setIsLoading(true);
            const result = await fetchEventParticipantsAction(eventId);
            if (result.success) {
                setRegistrations(result.data);
            }
            setIsLoading(false);
        }
    };

    const groupedRegistrations = registrations.reduce<Record<string, any[]>>((acc, reg) => {
        const distanceLabel = reg.distance || "Général";
        const mealsLabel = reg.meals?.length > 0 ? ` + ${reg.meals.join(", ")}` : "";
        const accLabel = reg.accommodations?.length > 0 ? ` + ${reg.accommodations.join(", ")}` : "";
        
        const finalLabel = `${distanceLabel}${mealsLabel}${accLabel}`;
        if (!acc[finalLabel]) acc[finalLabel] = [];
        acc[finalLabel].push(reg);
        return acc;
    }, {});

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-3 text-left hover:bg-primary/5 p-2 rounded-xl transition-all group/trigger">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover/trigger:bg-primary group-hover/trigger:text-white transition-colors">
                        <Users size={18} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground leading-none tracking-widest">Inscrits</span>
                        <span className="text-base font-black text-slate-800 group-hover/trigger:text-primary transition-colors">{participantCount}</span>
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] rounded-tl-[2rem] rounded-br-[2rem] border-none shadow-2xl">
                <DialogHeader className="flex flex-row items-center border-b pb-4">
                    <DialogTitle className="text-xl font-bold text-primary">Inscrits : {eventTitle}</DialogTitle>
                    <ExportEventButton
                        eventId={eventId}
                        participantCount={participantCount}
                    />
                </DialogHeader>

                <div className="max-h-[60vh] pr-2 overflow-y-auto mt-4">
                    {participantCount === 0 ? (
                        <TypographyDetail className="text-center py-12 block">
                            Aucun participant pour le moment.
                        </TypographyDetail>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {Object.entries(groupedRegistrations).map(([optionGroup, regs]) => (
                                <div key={optionGroup} className="space-y-4">
                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border-l-4 border-primary">
                                        <h4 className="font-bold text-primary text-sm tracking-tighter">{optionGroup}</h4>
                                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{regs.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {regs.map((reg: any) => (
                                            <div key={reg.id} className="py-2 px-4 hover:bg-slate-50 rounded-lg flex items-center justify-between text-sm transition-colors border border-transparent hover:border-slate-100">
                                                <span className="flex items-center gap-2">
                                                    <UserName name={reg.user.name} lastname={reg.user.lastname} />
                                                    {reg.carpooling && (
                                                        <span className="bg-primary/10 text-primary text-[10px] font-black px-1.5 py-0.5 rounded-sm" title="Propose un covoiturage">
                                                            C
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
