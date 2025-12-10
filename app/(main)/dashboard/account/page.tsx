import { ProfileForm } from '@/src/features/account/components/ProfileForm';
import { getProfile } from '@/src/features/account/dal';
import { getSession } from '@/src/lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();

  // 1. On vérifie d'abord si 'session' est null OU si 'userId' est absent
  if (!session || !session.userId) {
    redirect('/auth/login');
  }

  // Maintenant TypeScript sait que 'session' n'est pas null et a un userId
  const user = await getProfile(session.userId);
  
  if (!user) {
    return <div>Profil introuvable</div>;
  }
  
  // Note: J'utilise 'any' temporairement ici si ProfileForm attend un type strict, 
  // mais idéalement ProfileForm devrait accepter le type de retour de getProfile
  return <ProfileForm defaultValues={user} />;
}