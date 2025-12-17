"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { resetPassword } from "../../actions";
import ErrorCard from "@/components/common/ErrorCard";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import SuccesCard from "@/components/common/SuccesCard";
import ErrorBox from "../../../../../components/common/ErrorBox";

interface ResetPasswordFormProps {
    token: string
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {

    const [state, action, pending] = useActionState(resetPassword, undefined)
    if (state?.success) {
        return (
            <SuccesCard
                title=""
                message={state.message}
                link="/"
                linkMessage="Retour a l'accueil"
            />
        );
    }

    return (
        <form action={action} className="w-full space-y-6" noValidate>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
                <p className="text-sm text-gray-500">Choisissez un mot de passe sécurisé.</p>
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <div className="flex-1">
                    <Field>
                        <FieldLabel>Mot de passe</FieldLabel>
                        <Input id="password" name="password" type="password" required />
                    </Field>
                    {state?.error?.password && (
                        <p className="text-xs text-red-500 pl-1">{state.error.password}</p>
                    )}
                </div>
                <div className="flex-1">
                    <Field>
                        <FieldLabel>Confirmer</FieldLabel>
                        <Input id="confirmPassword" name="confirmPassword" type="password" required />
                    </Field>
                    {state?.error?.confirmPassword && (
                            <p className="text-xs text-red-500 pl-1">{state.error.confirmPassword }</p>
                        )}
                </div>
            </div>
            <input type="hidden" name="token" value={token} />
            <Button type='submit' className="w-full" disabled={pending}>
                {pending ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
            </Button>
            {state?.message && !state.success && (
                <ErrorBox error={state.message} />
            )}
        </form>
    )
} 