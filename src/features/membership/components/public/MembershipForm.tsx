"use client"

import { useActionState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormState } from "react-dom"
import { createMembershipRequest } from "../../memberships.actions"
import { Label, RadioGroup } from "@radix-ui/react-dropdown-menu"
import { RadioGroupItem } from "@/components/ui/radio-group"


export function MembershipForm() {
    const [state, action, pending] = useActionState(createMembershipRequest, undefined);
    const [isPending, startTransition] = useTransition();

    return (
        <form action={action} className="space-y-8 max-w-lg mx-auto py-6">

            {/* --- TYPE D'ADHÉSION --- */}
            <div className="space-y-3">
                <h3 className="text-lg font-medium">Type d'adhésion</h3>
                <RadioGroup
                    defaultValue={'INDIVIDUAL'}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="INDIVIDUAL" id="t-indi" />
                        <Label>Individuel</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="COUPLE" id="t-couple" />
                        <Label>Couple</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="YOUNG" id="t-young" />
                        <Label>Jeune (-18)</Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-slate-50">
                        <RadioGroupItem value="LICENSE_RUNNING" id="t-run" />
                        <Label>Licence Running (FFA)</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* --- INFORMATIONS COMPLÉMENTAIRES --- */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label >Numéro de licence FFA (si renouvellement)</Label>
                    <Input id="ffa" name="ffa" placeholder="Ex: 123456" />
                </div>
                <div className="space-y-2">
                    <Label >Ancien Club</Label>
                    <Input id="club" name="club" placeholder="Nom du club" />
                </div>
            </div>

            {/* --- CONSENTEMENTS (RGPD) --- */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Consentements</h3>

                <h3 className="font-medium text-sm flex items-center gap-2">
                    Parution dans l'annuaire des adhérents
                </h3>
                <p className="text-xs text-muted-foreground">
                    Ces informations seront visibles uniquement par les autres membres connectés.
                </p>

                <div className="flex flex-col gap-2">
                    {/* PHONE DIFFUSION */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="showPhoneDirectory" name="showPhoneDirectory" />
                        <label
                            htmlFor="showPhoneDirectory"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            J'accepte de diffuser mon téléphone
                        </label>
                    </div>

                    {/* E-MAIL DIFFUSION */}
                    <div className="flex items-center space-x-2">
                        <Checkbox id="showEmailDirectory" name="showEmailDirectory" />
                        <label
                            htmlFor="showEmailDirectory"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Envoi en cours..." : "Valider ma demande d'adhésion"}
            </Button>

        </form>
    )
}