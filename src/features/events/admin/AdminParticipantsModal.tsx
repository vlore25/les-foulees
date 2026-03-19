// src/features/events/admin/AdminParticipantsModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon, Loader2 } from "lucide-react";
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
    const [registrations, setRegistrations] = useState<any[]>([]); // On stocke les inscrits ici

    // Cette fonction se déclenche quand on clique sur l'œil (ouverture/fermeture)
    const handleOpenChange = async (open: boolean) => {
        setIsOpen(open);

        // On ne fait l'appel au serveur QUE si la modal s'ouvre ET qu'il y a des inscrits
        if (open && participantCount > 0) {
            setIsLoading(true);

            // Appel de notre Server Action (qui va elle-même appeler le DAL)
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
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted">
                        {participantCount}
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="flex flex-row items-center">
                    <DialogTitle>Inscrits : {eventTitle}</DialogTitle>
                    <ExportEventButton
                        eventId={eventId}
                        participantCount={participantCount}
                    />
                </DialogHeader>

                <div className="max-h-[60vh] pr-4 overflow-y-auto">
                    {participantCount === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            Aucun participant pour le moment.
                        </p>
                    ) : isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="flex flex-col mt-2 gap-6">

                            {Object.entries(groupedRegistrations).map(([distance, regs]) => (
                                <div key={distance} className="space-y-3">

                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-primary">{distance}</h4>
                                                {regs.length}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {regs.map((reg: any) => (
                                            <div key={reg.id} className="py-1 px-2 hover:bg-muted/50 rounded-md flex items-center justify-between text-sm transition-colors">
                                                <span>
                                                    {reg.user.name} <span className="font-bold uppercase">{reg.user.lastname}</span>
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