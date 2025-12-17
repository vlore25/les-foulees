"use client"

import { sendPasswordResetEmail } from "../actions";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import ErrorBox from "../../../../components/common/ErrorBox";
import Link from "next/link";
import FouleesLogo from "@/components/common/logo/FouleesLogo";
import Image from "next/image";
import hero from '../../../../public/images/login-hero.jpg';
import SuccesCard from "@/components/common/SuccesCard";

export default function ForgotPasswordForm() {

    const [state, action, pending] = useActionState(sendPasswordResetEmail, undefined);

    return (
        <main className='
            flex flex-col w-full max-w-md mx-auto my-10 bg-white shadow-2xl rounded-2xl overflow-hidden
            lg:grid lg:grid-cols-2 lg:max-w-5xl lg:min-h-[600px]
        '>
            <div className='flex flex-col items-center justify-center w-full p-6 py-10 lg:p-12 gap-6'>
                <FouleesLogo size={140} className="!w-[120px] lg:!w-[140px]" />
                {state?.success ? (
                    <SuccesCard
                        title=""
                        message={state.message}
                        link="/"
                        linkMessage="Retour a l'accueil"
                    />

                ) : (
                    <form action={action} className='w-full max-w-xs space-y-6' noValidate>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Mot de passe oublié ?
                            </h2>
                            <p className="text-sm text-gray-500">
                                Entrez votre email. Vous recevrez un lien de réinitialisation valide pendant <strong>1 heure</strong>.
                            </p>
                        </div>

                        <InputGroup>
                            <InputGroupInput
                                name="email"
                                type="email"
                                placeholder="Courriel"
                                id="credentials-email"
                                required
                            />
                            <InputGroupAddon>
                                <UserCircle className="text-gray-500" />
                            </InputGroupAddon>
                        </InputGroup>
                        {state?.error?.email && <p className="text-xs text-red-500">{state.error.email}</p>}
                        <Button type='submit' className="w-full" disabled={pending}>
                            {pending ? "Envoi en cours..." : "Envoyer le lien"}
                        </Button>
                        {state?.message && (
                            <ErrorBox error={state.message} />
                        )}

                    </form>
                )}
                <div className='flex justify-center text-sm text-gray-600 mt-4'>
                    <Link
                        href="/login"
                        className='text-primary font-bold hover:underline flex items-center gap-2'
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à la connexion
                    </Link>
                </div>
            </div>
            <div className='hidden lg:flex relative bg-gray-900'>
                <Image
                    src={hero}
                    alt="Image de fond"
                    fill
                    className="object-cover opacity-90"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
        </main>
    );
}