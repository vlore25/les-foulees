// app/(admin)/layout.tsx
import { getSession } from '@/lib/dal';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
   
    return (
        <div className="admin-wrapper">
            {children}
        </div>
    );
}