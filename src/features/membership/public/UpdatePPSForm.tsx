"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FileInput } from "@/components/ui/file-input"
import { updatePPSCertificateAction } from "../memberships.actions"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface UpdatePPSFormProps {
    currentCertificateUrl?: string | null;
}

const initialState = {
    message: "",
    success: false,
    errors: {}
}

export function UpdatePPSForm({ currentCertificateUrl }: UpdatePPSFormProps) {
    const [state, action, pending] = useActionState(updatePPSCertificateAction, initialState);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <FileInput
                    id="medicalCertificate"
                    name="medicalCertificate"
                    accept=".pdf,image/*"
                    required
                    label={currentCertificateUrl ? "Sélectionner une nouvelle attestation PPS" : "Sélectionner votre attestation PPS *"}
                />
                {state?.errors?.medicalCertificate && (
                    <p className="text-xs text-red-500 font-bold italic">{state.errors.medicalCertificate[0]}</p>
                )}
            </div>

            {state?.message && !state.success && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.message}</span>
                </div>
            )}

            {showSuccess && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{state?.message || "Attestation PPS mise à jour avec succès ! Votre dossier est repassé en attente de validation."}</span>
                </div>
            )}

            <Button
                type="submit"
                disabled={pending}
                className="w-full sm:w-auto px-6 font-bold uppercase tracking-wider text-xs"
            >
                {pending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mise à jour en cours...
                    </>
                ) : (
                    "Mettre à jour l'attestation"
                )}
            </Button>
        </form>
    );
}
