"use client"

import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { signIn } from '@/lib/auth-client';
import { LockKeyhole, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, setIsPending] = useState(false);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        const res = await signIn.email({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        });
        setIsPending(true);
        if (res.error) {
            setError(res.error.message || "Un erreur est survenu, veuillez réessayer.");
            setIsPending(false);
        } else {
            router.push("/dashboard/users");
            console.log(res);
        }
    }

    return (
        <div className='absolute flex flex-col items-center justify-center h-full w-full'>
            <h2 className='text-center'>Se connecter</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
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
                {error && <p className="text-red-500">{error}</p>}
                <Button disabled={isPending} type="submit">Se connecter</Button>
                <div className='flex gap-1.5 justify-center'>
                    <p>Pas encore adherant?</p>
                    <Link href="/contact" className='text-primary'>Rejoignez-nous</Link>
                </div>
            </form>
        </div>
    );
}
export default LoginForm;