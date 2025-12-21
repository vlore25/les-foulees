"use client"

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";
import { useActionState } from "react";
import { sendInviteAction } from "../user.action";
import { InviteUserState } from "@/src/lib/definitions";
import ErrorBox from "@/components/common/feedback/ErrorBox";
import SuccesBox from "@/components/common/feedback/SuccesBox";

const initialState: InviteUserState = {
    message: null,
    success: false,
    errors: {}
};

export default function InviteForm() {
    const [state, action, pending] = useActionState(sendInviteAction, initialState);

    return (
        <div>
            <h2>Inviter un nouveau membre</h2>
            <p>La personne recevra un lien unique dans sa boite email.</p>
            <form action={action} noValidate>
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
                {state?.message && !state.success &&
                    <ErrorBox error ={state.message}/> 
                }
                {state?.message && state.success &&
                    <SuccesBox message ={state.message}/> 
                }
                <Button disabled={pending} type="submit" className="p-2 rounded w-full disabled:opacity-50 mt-4">
                    {pending ? 'Envoi en cours...' : 'Envoyer invitation'}
                </Button>
            </form>
        </div>
    );
}