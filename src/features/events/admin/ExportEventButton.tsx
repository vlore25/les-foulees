// src/features/events/admin/ExportEventButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { exportEventParticipantsAction } from "../events.actions";

interface ExportBtnProps {
    eventId: string;
    participantCount: number;
    distance?: string; // NOUVEAU
}

export default function ExportEventButton({ eventId, participantCount, distance }: ExportBtnProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        if (participantCount === 0) {
            toast.info("Aucun participant à exporter.");
            return;
        }

        setIsLoading(true);
        try {
            // On passe la distance à l'action
            const result = await exportEventParticipantsAction(eventId, distance);

            if (!result.success || !result.csv) {
                toast.error(result.message || "Erreur lors de l'export.");
                return;
            }

            const blob = new Blob(["\uFEFF" + result.csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;


            const cleanTitle = result.title.replace(/\s+/g, '_').toLowerCase();
            const cleanDistance = distance ? `_${distance.replace(/\s+/g, '_').toLowerCase()}` : '';

            link.setAttribute('download', `inscrits_${cleanTitle}${cleanDistance}.csv`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Export réussi !");
        } catch (error) {
            toast.error("Erreur serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleExport}
            disabled={isLoading}
            title={distance ? `Exporter les inscrits (${distance})` : "Exporter tous les inscrits"}
            className="h-8 w-8"
        >
            <Download className="w-4 h-4 text-primary" />
        </Button>
    );
}