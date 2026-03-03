"use client"

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MailIcon } from "lucide-react";
import { useActionState } from "react";
import { sendInviteAction } from "../user.action";
import { InviteUserState } from "@/src/lib/definitions";
import ErrorBox from "@/components/common/feedback/ErrorBox";
import SuccesBox from "@/components/common/feedback/SuccesBox";
import { Field, FieldDescription } from "@/components/ui/field";

const initialState: InviteUserState = {
    message: null,
    success: false,
    errors: {}
};

export default function InviteForm() {
    const [state, action, pending] = useActionState(sendInviteAction, initialState);

    return (
        <div className="flex flex-col space-y-4 w-full lg:w-[50%]">
            <h4>Inviter un nouveau membre</h4>
            <form action={action} noValidate>
                <Field>
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
                    <FieldDescription>La personne recevra un lien unique dans sa boite email.</FieldDescription>
                </Field>
                {state?.errors?.email && (
                    <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
                )}
                {state?.message && !state.success &&
                    <ErrorBox error={state.message} />
                }
                {state?.message && state.success &&
                    <SuccesBox message={state.message} />
                }
                <Button disabled={pending} type="submit" className="disabled:opacity-50 mt-4">
                    {pending ? 'Envoi en cours...' : 'Envoyer invitation'}
                </Button>
            </form>
        </div>
    );
}