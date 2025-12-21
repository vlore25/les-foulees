import { ProfileForm } from '@/src/features/account/components/ProfileForm';
import { getProfile } from '@/src/features/account/dal';
import { getSession } from '@/src/lib/session';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/auth/login');
  }

  const user = await getProfile(session.userId);
  
  if (!user) {
    return <div>Profil introuvable</div>;
  }

  return <ProfileForm key={user.email} defaultValues={user} />;
}