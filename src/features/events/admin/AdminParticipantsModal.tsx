// src/features/events/admin/AdminParticipantsModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Loader2 } from "lucide-react";
import ExportEventButton from "./ExportEventButton";
import { fetchEventParticipantsAction } from "../events.actions";

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
        if (!acc[distanceLabel]) acc[distanceLabel] = [];
        acc[distanceLabel].push(reg);
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
                    <DialogTitle className="text-xl font-black uppercase text-primary">Inscrits : {eventTitle}</DialogTitle>
                    <ExportEventButton
                        eventId={eventId}
                        participantCount={participantCount}
                    />
                </DialogHeader>

                <div className="max-h-[60vh] pr-2 overflow-y-auto mt-4">
                    {participantCount === 0 ? (
                        <p className="text-sm font-bold italic text-muted-foreground text-center py-12 uppercase tracking-widest">
                            Aucun participant pour le moment.
                        </p>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {Object.entries(groupedRegistrations).map(([distance, regs]) => (
                                <div key={distance} className="space-y-4">
                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border-l-4 border-primary">
                                        <h4 className="font-black uppercase text-primary text-xs tracking-tighter">{distance}</h4>
                                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{regs.length}</span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {regs.map((reg: any) => (
                                            <div key={reg.id} className="py-2 px-4 hover:bg-slate-50 rounded-lg flex items-center justify-between text-sm transition-colors border border-transparent hover:border-slate-100">
                                                <span className="font-medium text-slate-700">
                                                    {reg.user.lastname.toUpperCase()} <span className="text-primary font-bold">{reg.user.name}</span>
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
