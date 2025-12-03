// app/auth/login/components/LoginForm.tsx
"use client"

import { loginUser } from '@/src/features/auth/actions';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LockKeyhole, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import Image from 'next/image';
import hero from '../../../../../public/images/login-hero.jpg';

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginUser, undefined); 

    return (
        <main className='flex flex-col lg:grid lg:grid-cols-2 w-full max-w-1xl lg:mx-50 my-10 shadow-xl overflow-hidden rounded-xl h-[70vh]'>
            <div className='flex flex-col items-center justify-center w-full py-10'>
            <h1 className='text-center lg:text-5xl'>Se connecter</h1>
            <form action={action} className='space-y-4 w-full max-w-sm px-2 lg:px-0'>
                <InputGroup>
                    <InputGroupInput
                        name="email"
                        type="email"
                        placeholder="Courriel"
                        id="credentials-email"
                        required
                    />
                    <InputGroupAddon>
                        <UserCircle />
                    </InputGroupAddon>
                </InputGroup>
                {state?.error?.email && <p>{state.error.email}</p>}
                <div >
                    <InputGroup>
                        <InputGroupInput
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                            id="credentials-password"
                            required
                        />
                        <InputGroupAddon>
                            <LockKeyhole />
                        </InputGroupAddon>
                    </InputGroup>
                    {state?.error?.password && <p>{state.error.password}</p>}
                    <Link href="/recuperation" className='text-primary'>Mot de passe oublié?</Link>
                </div>
                <Button disabled={pending}>
                    {pending ? "Connexion..." : "Se connecter"}
                </Button>
                <div className='flex justify-center gap-0.5 lg:gap-1 '>
                    <span>Pas encore adherant?</span>
                    <Link href="/contact" className='text-primary'>Rejoignez-nous</Link>
                </div>
            </form>
            </div>
           <div className='hidden lg:flex bg-accent relative justify-center items-center p-8 text-white'>
    <Image 
        src={hero}
        alt="Image de fond promotionnelle" 
        fill 
        className="object-cover" 
    />
</div>
        </main>
    );
}
export default LoginForm;