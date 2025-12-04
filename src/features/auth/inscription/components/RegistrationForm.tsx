// app/auth/register/components/RegisterForm.tsx
'use client'
 
import { registerUser } from '@/src/features/auth/actions'
import { Button } from '@/components/ui/button'
import { useActionState } from 'react'
 
export default function RegistrationForm({ email, token }: { email: string, token: string }) {
  const [state, action, pending] = useActionState(registerUser, undefined)
 
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Prénom</label>
        <input id="name" name="name" placeholder="Votre prénom" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.name && <p className="text-red-500 text-sm">{state.error.name}</p>}
      <div>
        <label htmlFor="lastname" className="block text-sm font-medium">Nom de Famille</label>
        <input id="lastname" name="lastname" placeholder="Nom" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.lastname && <p className="text-red-500 text-sm">{state.error.lastname}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium" >Courriel</label>
        <input id="email" name="email" placeholder="Adresse e-mail" className="border p-2 rounded w-full" value={email} readOnly/>
      </div>
      {state?.error?.email && <p>{state.error.email}</p>}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
        <input id="password" name="password" type="password" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.password && (
        <div className="text-red-500 text-sm">
          <ul>
            {state.error.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      {state?.message && <p className="text-red-500 text-sm font-bold">{state.message}</p>}

      <Button disabled={pending} type="submit" className=" p-2 rounded w-full disabled:opacity-50">
        {pending ? 'Enregistrement en cours' : 'S’inscrire'}
      </Button>
    </form>
  )
}