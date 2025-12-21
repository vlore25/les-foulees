"use client"

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";
import { useActionState } from "react";
import { sendInviteAction } from "../user.action";
import { InviteUserState } from "@/src/lib/definitions";

const initialState: InviteUserState = {
    message: null,
    success: false,
    errors: {}
};

export default function InviteForm() {
    // AU LIEU DE 'undefined', on passe 'initialState'
    const [state, action, pending] = useActionState(sendInviteAction, initialState);

    return (
        <div>
            <h2>Inviter un nouveau membre</h2>
            <p>La personne recevra un lien unique dans sa boite email.</p>
            <form action={action}>
                <InputGroup>
                    <InputGroupInput 
                        name="email" 
                        type="email" 
                        placeholder="Saisir le email du future membre" 
                    />
                    <InputGroupAddon>
                        <MailIcon />
                    </InputGroupAddon>
                </InputGroup>
                {state?.errors?.email && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
                )}
                {state?.message && (
                    <p className={`text-sm font-bold mt-2 ${state.success ? 'text-green-600' : 'text-red-500'}`}>
                        {state.message}
                    </p>
                )}
                <Button disabled={pending} type="submit" className="p-2 rounded w-full disabled:opacity-50 mt-4">
                    {pending ? 'Envoi en cours...' : 'Envoyer invitation'}
                </Button>
            </form>
        </div>
    );
}