// app/auth/login/components/LoginForm.tsx
"use client"

import { loginUser } from '@/src/features/auth/actions';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LockKeyhole, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

const LoginForm = () => {
    const [state, action, pending] = useActionState(loginUser, undefined); 

    return (
        <div className='absolute lg:static flex flex-col items-center justify-center h-full w-full'>
            <h2 className='text-center'>Se connecter</h2>
            <form action={action} className='space-y-4'>
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
                <div className='flex gap-1.5 justify-center'>
                    <p>Pas encore adherant?</p>
                    <Link href="/contact" className='text-primary'>Rejoignez-nous</Link>
                </div>
            </form>
        </div>
    );
}
export default LoginForm;