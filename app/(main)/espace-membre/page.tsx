import { getCurrentUser } from '@/src/features/users/dal'
import { redirect } from 'next/navigation'

export default async function MemberSpacePage() {
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