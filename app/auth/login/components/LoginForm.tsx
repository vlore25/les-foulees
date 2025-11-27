"use client"

import { loginUser } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { LockKeyhole, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

interface State {
    error?: string;
}

const initialState: State = {};

const LoginForm = () => {
    const [state, formAction] = useActionState(loginUser, initialState);
    const { pending } = useFormStatus();

    return (
        <div className='absolute lg:static flex flex-col items-center justify-center h-full w-full'>
            <h2 className='text-center'>Se connecter</h2>
            <form  action={formAction} className='space-y-4'>
                <InputGroup>
                    <InputGroupInput
                        name="email"
                        type="email"
                        placeholder="Courriel"
                        required
                    />
                    <InputGroupAddon>
                        <UserCircle />
                    </InputGroupAddon>
                </InputGroup>
                <div >
                    <InputGroup>
                        <InputGroupInput
                            name="password"
                            type="password"
                            placeholder="Mot de passe" 
                            required
                            />
                        <InputGroupAddon>
                            <LockKeyhole />
                        </InputGroupAddon>
                    </InputGroup>
                    <Link href="/recuperation" className='text-primary'>Mot de passe oublié?</Link>
                </div>
                {state.error && <p className="text-red-500">{state.error}</p>}
                <Button disabled={pending} type="submit">{pending ? 'Connexion...' : 'Se connecter'}</Button>
                <div className='flex gap-1.5 justify-center'>
                    <p>Pas encore adherant?</p>
                    <Link href="/contact" className='text-primary'>Rejoignez-nous</Link>
                </div>
            </form>
        </div>
    );
}
export default LoginForm;