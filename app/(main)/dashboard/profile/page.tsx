// app/(main)/dashboard/profile/page.tsx
import { getSession } from '@/src/lib/session'
import { prisma } from '@/src/lib/prisma'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getSession()
  
  if (!session.userId) {
    redirect('/auth/login')
  }
  
  // Charger les données complètes du user
  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  })
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}