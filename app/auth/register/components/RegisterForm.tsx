// app/auth/register/components/RegisterForm.tsx
'use client'
 
import { registerUser } from '@/app/actions/auth'
import { useActionState } from 'react'
 
export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, undefined)
 
  return (
    <form action={action} className="space-y-4">
      {/* First Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">First Name</label>
        <input id="name" name="name" placeholder="John" className="border p-2 rounded w-full" />
      </div>
      {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}

      {/* Last Name - NEW */}
      <div>
        <label htmlFor="lastname" className="block text-sm font-medium">Last Name</label>
        <input id="lastname" name="lastname" placeholder="Doe" className="border p-2 rounded w-full" />
      </div>
      {state?.errors?.lastname && <p className="text-red-500 text-sm">{state.errors.lastname}</p>}
 
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" name="email" placeholder="john@example.com" className="border p-2 rounded w-full" />
      </div>
      {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
 
      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input id="password" name="password" type="password" className="border p-2 rounded w-full" />
      </div>
      {state?.errors?.password && (
        <div className="text-red-500 text-sm">
          <p>Password requirements:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* General Error Message */}
      {state?.message && <p className="text-red-500 text-sm font-bold">{state.message}</p>}

      <button disabled={pending} type="submit" className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50">
        {pending ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  )
}