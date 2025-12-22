"use client"

import { loginUser } from '@/src/features/auth/auth.actions';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LockKeyhole, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import Image from 'next/image';
import hero from '../../../../../public/images/login-hero.jpg';
import FouleesLogo from '@/components/common/logo/FouleesLogo';
import ErrorBox from '../../../../../components/common/feedback/ErrorBox';

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginUser, undefined);

    return (
        // Mobile: Flex column, largeur max-md (carte centrée), marges auto
        // Desktop (lg): Grid 2 colonnes, largeur max-4xl ou 5xl, hauteur fixe ou min
        <main className='
            flex flex-col w-full max-w-md mx-auto my-10 bg-white shadow-lg rounded-lg overflow-hidden
            lg:grid lg:grid-cols-2 lg:max-w-5xl lg:min-h-[600px]
        '>
            <div className='flex flex-col items-center justify-center w-full p-3 py-10 lg:p-12 gap-6'>
                <div className="flex flex-col items-center gap-2">
                    <FouleesLogo size={140} className="w-[100px] lg:w-[140px]" />
                    <h1 className='text-3xl font-bold text-gray-900 lg:text-4xl text-center'>
                        Se connecter
                    </h1>
                </div>

                <form action={action} className='w-full space-y-5' noValidate>

                    {/* Input Email */}
                    <div className="space-y-1">
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
                        {state?.error?.email && (
                            <p className="text-xs text-red-500 pl-1">{state.error.email}</p>
                        )}
                    </div>

                    {/* Input Password + Lien oubli */}
                    <div className="space-y-1">
                        <InputGroup>
                            <InputGroupInput
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                id="credentials-password"
                                required
                            />
                            <InputGroupAddon>
                                <LockKeyhole className="text-gray-500" />
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex justify-between items-center pt-1">
                            {state?.error?.password ? (
                                <p className="text-xs text-red-500 pl-1">{state.error.password}</p>
                            ) : <span></span>}

                            <Link href="/recuperation" className='text-xs text-primary hover:underline font-medium'>
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Button disabled={pending} className="w-full text-lg h-11">
                            {pending ? "Connexion..." : "Se connecter"}
                        </Button>

                        <div className='flex justify-center gap-1 text-sm text-gray-600'>
                            <span>Pas encore adhérent ?</span>
                            <Link href="/contact" className='text-primary font-bold hover:underline'>
                                Rejoignez-nous
                            </Link>
                        </div>
                    </div>
                    {state?.message && (
                        <ErrorBox error={state.message} />
                    )}
                </form>
            </div>
            <div className='hidden lg:flex relative bg-gray-900'>
                <Image
                    src={hero}
                    alt="Image de login"
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
export default LoginForm;