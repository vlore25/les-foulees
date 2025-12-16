"use client"

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    data: any[]; // Vos données d'adhésion
    filename?: string;
}

export default function ExportButton({ data, filename = "adherents.csv" }: ExportButtonProps) {

    const handleExport = () => {
        if (!data || data.length === 0) {
            alert("Aucune donnée à exporter");
            return;
        }

        // 1. Définir les en-têtes du CSV
        const headers = [
            "Nom", 
            "Prénom", 
            "Email", 
            "Téléphone", 
            "Date Naissance",
            "Adresse",
            "Code Postal",
            "Ville",
            "Saison", 
            "Type Licence", 
            "Numéro FFA", 
            "Statut Paiement", 
            "Montant", 
            "Statut Dossier"
        ];

        const rows = data.map(row => [
            `"${row.user.lastname}"`, 
            `"${row.user.name}"`,
            row.user.email,
            row.user.phone || "",
            row.user.birthdate ? new Date(row.user.birthdate).toLocaleDateString() : "",
            `"${row.user.address || ""}"`,
            row.user.zipCode || "",
            `"${row.user.city || ""}"`,
            row.season.name,
            row.type,
            row.ffaLicenseNumber || "",
            row.payment?.status || "N/A",
            row.payment?.amount || 0,
            row.status
        ]);

        const csvContent = [
            "\uFEFF" + headers.join(";"), 
            ...rows.map(r => r.join(";"))
        ].join("\n");

        // 4. Déclencher le téléchargement
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Exporter CSV
        </Button>
    );
}