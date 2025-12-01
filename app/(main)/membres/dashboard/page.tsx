// app/(main)/dashboard/page.tsx
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getSession()
  
  // Si pas de session, rediriger vers login
  if (!session.isLoggedIn) {
    redirect('/')
  }
  
  // User est connecté!
  return (
    <div>
      <h1>Welcome {session.email}</h1>
    </div>
  )
}