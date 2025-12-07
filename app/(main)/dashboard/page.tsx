// app/(main)/dashboard/page.tsx
import { getCurrentUser } from '@/src/features/users/dal'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }
  
  return (
    <div>
      <h1>Bienvenue {user.name}</h1>
    </div>
  )
}