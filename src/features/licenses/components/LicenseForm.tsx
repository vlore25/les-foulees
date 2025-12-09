'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { submitLicenseRequest } from "../licenses.actions"

export const LicenseForm = () => {
    return (
        <form action={submitLicenseRequest} className="space-y-6 max-w-md mx-auto p-6 border rounded shadow">
            <h2 className="text-2xl font-bold">Renouvellement Licence</h2>
            
            <div className="space-y-2">
                <label className="font-medium">Type d'adhésion</label>
                <Select name="type" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="STANDARD">Individuel (35€)</SelectItem>
                        <SelectItem value="COUPLE">Couple (60€)</SelectItem>
                        <SelectItem value="YOUNG">Jeune -18 (25€)</SelectItem>
                        <SelectItem value="FFA">Licence Running (98€)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="font-medium">Numéro de Licence (si FFA)</label>
                <Input name="licenseNumber" placeholder="Ex: 123456" />
            </div>

            {/* Ajouter Input File pour le certificat ici */}

            <Button type="submit" className="w-full bg-indigo-600">
                Valider ma demande et Payer
            </Button>
        </form>
    )
}