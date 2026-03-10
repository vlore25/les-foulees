"use client"

import { loginUser } from '@/src/features/auth/auth.actions';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LockKeyhole, UserCircle, ChevronLeft } from 'lucide-react'; // Ajout de ChevronLeft
import Link from 'next/link';
import { useActionState } from 'react';
import Image from 'next/image';
import hero from '../../../../../public/images/login-hero.jpg';
import FouleesLogo from '@/components/common/logo/FouleesLogo';
import ErrorBox from '../../../../../components/common/feedback/ErrorBox';
import { Label } from '@/components/ui/Label';

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginUser, undefined);

    return (
        <main className='
            flex flex-col w-full max-w-md mx-auto my-10 bg-white shadow-2xl 
            rounded-none rounded-tl-[3rem] rounded-br-[3rem] overflow-hidden
            lg:grid lg:grid-cols-2 lg:max-w-5xl lg:min-h-[600px]
            relative
        '>
            <div className='flex flex-col items-center justify-center w-full p-4 py-10 lg:p-12 gap-6 relative'>
                <Link 
                    href="/" 
                    className="absolute top-6 left-6 flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                    <ChevronLeft size={18} />
                    <span>Retour</span>
                </Link>

                <div className="flex flex-col items-center gap-2 mt-4">
                    <FouleesLogo size={140} className="w-[100px] lg:w-[140px]" />
                    <h1 className='text-3xl font-black uppercase text-primary-700 lg:text-4xl text-center tracking-tighter'>
                        Se connecter
                    </h1>
                </div>

                <form action={action} className='w-full space-y-5' noValidate>
                    {state?.message && (
                        <div className="">
                            <ErrorBox error={state.message} />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label
                            htmlFor="credentials-email" 
                            className="text-xs font-bold uppercase tracking-widest text-primary-700 ml-1"
                        >
                            Email
                        </Label>
                        <InputGroup>
                            <InputGroupInput
                                name="email"
                                type="email"
                                placeholder="votre@email.com"
                                id="credentials-email"
                                required
                            />
                            <InputGroupAddon>
                                <UserCircle/>
                            </InputGroupAddon>
                        </InputGroup>
                        {state?.error?.email && (
                            <p className="text-xs text-red-500 pl-1">{state.error.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label 
                            htmlFor="credentials-password" 
                            className="text-xs font-bold uppercase tracking-widest text-primary-700 ml-1"
                        >
                            Mot de passe
                        </Label>
                        <InputGroup>
                            <InputGroupInput
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                id="credentials-password"
                                required
                            />
                            <InputGroupAddon>
                                <LockKeyhole/>
                            </InputGroupAddon>
                        </InputGroup>

                        <div className="flex justify-between items-center pt-1">
                            {state?.error?.password ? (
                                <p className="text-xs text-red-500 pl-1">{state.error.password}</p>
                            ) : <span></span>}

                            <Link href="/recuperation" className='text-xs text-primary hover:underline font-bold uppercase tracking-wider'>
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <Button
                            disabled={pending}
                            className="w-full text-lg h-12 font-bold uppercase rounded-none rounded-tl-xl rounded-br-xl shadow-lg"
                        >
                            {pending ? "Connexion..." : "Se connecter"}
                        </Button>

                        <div className='flex justify-center gap-1 text-sm text-gray-600'>
                            <span>Pas encore adhérent ?</span>
                            <Link href="/contact" className='text-primary font-bold hover:underline'>
                                Contactez-nous
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            <div className='hidden lg:flex relative bg-gray-900 overflow-hidden'>
                <Image
                    src={hero}
                    alt="Image de login"
                    fill
                    className="object-cover opacity-80"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent"></div>
            </div>
        </main>
    );
}

export default LoginForm;