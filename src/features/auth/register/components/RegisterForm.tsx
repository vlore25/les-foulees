// app/auth/register/components/RegisterForm.tsx
'use client'
 
import { registerUser } from '@/src/features/auth/actions'
import { Button } from '@/components/ui/button'
import { useActionState } from 'react'
 
export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, undefined)
 
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">First Name</label>
        <input id="name" name="name" placeholder="John" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.name && <p className="text-red-500 text-sm">{state.error.name}</p>}
      <div>
        <label htmlFor="lastname" className="block text-sm font-medium">Last Name</label>
        <input id="lastname" name="lastname" placeholder="Doe" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.lastname && <p className="text-red-500 text-sm">{state.error.lastname}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" name="email" placeholder="john@example.com" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.email && <p>{state.error.email}</p>}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" className="border p-2 rounded w-full" />
      </div>
      {state?.error?.password && (
        <div className="text-red-500 text-sm">
          <p>Password requirements:</p>
          <ul>
            {state.error.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      {state?.message && <p className="text-red-500 text-sm font-bold">{state.message}</p>}

      <Button disabled={pending} type="submit" className=" p-2 rounded w-full disabled:opacity-50">
        {pending ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  )
}