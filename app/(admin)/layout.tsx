// app/(admin)/layout.tsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '../actions/user';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // 1. Vérifier la connexion
    if (!session.userId) {
        redirect('/auth/login');
    }

    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/admin/dashboard');
    }

    return (
        <div className="admin-wrapper">
            {children}
        </div>
    );
}