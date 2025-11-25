// app/(main)/dashboard/page.tsx
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  
  // Si pas de session, rediriger vers login
  if (!session.isLoggedIn) {
    redirect('/auth/login')
  }
  
  // User est connecté!
  return (
    <div>
      <h1>Welcome {session.email}</h1>
    </div>
  )
}