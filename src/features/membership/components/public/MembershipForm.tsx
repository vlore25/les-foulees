"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createMembershipRequest } from "../../memberships.actions"
import { Label } from "@radix-ui/react-label"

const initialState = {
    message: "",
    success: false,
    errors: {}
}

export function MembershipForm() {
    // Utilisation de initialState pour éviter les erreurs au premier rendu
    const [state, action, pending] = useActionState(createMembershipRequest, initialState);

    return (
        <form action={action} className="space-y-8 max-w-lg mx-auto py-6">

            {/* Messages de retour */}
            {state?.message && (
                <div className={`p-4 rounded-md text-sm ${state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {state.message}
                </div>
            )}

            {/* --- TYPE D'ADHÉSION --- */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium">Type d'adhésion</h3>
                <RadioGroup
                    name="type" // Important pour le FormData
                    defaultValue={'INDIVIDUAL'}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="INDIVIDUAL" id="t-indi" />
                        <Label htmlFor="t-indi" className="cursor-pointer">Individuel</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="COUPLE" id="t-couple" />
                        <Label htmlFor="t-couple" className="cursor-pointer">Couple</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="YOUNG" id="t-young" />
                        <Label htmlFor="t-young" className="cursor-pointer">Jeune (-18)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="LICENSE_RUNNING" id="t-run" />
                        <Label htmlFor="t-run" className="cursor-pointer">Licence Running (FFA)</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* --- INFORMATIONS COMPLÉMENTAIRES --- */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ffa">Numéro de licence FFA (si renouvellement)</Label>
                    <Input id="ffa" name="ffa" placeholder="Ex: 123456" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="club">Ancien Club</Label>
                    <Input id="club" name="club" placeholder="Nom du club" />
                </div>
            </div>

            {/* --- CONSENTEMENTS (RGPD) --- */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Consentements</h3>

                <div className="space-y-1">
                    <h4 className="font-medium text-sm">Parution dans l'annuaire des adhérents</h4>
                    <p className="text-xs text-muted-foreground">
                        Ces informations seront visibles uniquement par les autres membres connectés.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    {/* PHONE DIFFUSION */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="showPhoneDirectory" name="showPhoneDirectory" />
                        <label
                            htmlFor="showPhoneDirectory"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            J'accepte de diffuser mon téléphone
                        </label>
                    </div>

                    {/* E-MAIL DIFFUSION */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="showEmailDirectory" name="showEmailDirectory" />
                        <label
                            htmlFor="showEmailDirectory"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            J'accepte de diffuser mon adresse e-mail
                        </label>
                    </div>
                </div>
            </div>

            {/* --- PAIEMENT --- */}
            <div className="space-y-3 border-t pt-4">
                <h3 className="text-lg font-medium">Moyen de paiement</h3>
                <Select
                    name="paymentMethod" // Important pour le FormData
                    defaultValue="CHECK"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choisir un moyen de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CHECK">Chèque</SelectItem>
                        <SelectItem value="TRANSFER">Virement Bancaire</SelectItem>
                        <SelectItem value="CASH">Espèces</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                    Le paiement sera validé manuellement par le trésorier après réception.
                </p>
            </div>

            {/* --- SUBMIT --- */}
            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Envoi en cours..." : "Valider ma demande d'adhésion"}
            </Button>

        </form>
    )
}