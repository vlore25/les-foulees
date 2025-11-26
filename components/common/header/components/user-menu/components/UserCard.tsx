// components/user-card.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // Make sure to import your prisma instance

export default async function UserCard() {
    const session = await getSession();

    if (!session || !session.userId) {
        return null;
    }
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true, lastname: true, email: true }
    });

    if (!user) return null;

    const getInitials = (name: string, lastName: string) => {
        const parts = name.trim().split(" ");
        const firstInitial = Array.from(name)[0];
        const lastInitial = Array.from(lastName)[0];
        return (firstInitial + lastInitial).toUpperCase();
    };

    const initials = user.name ? getInitials(user.name, user.lastname) : "??";

    return (
        <div className="flex gap-2.5 content-center">
            <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
            <div className="flex gap-1.5">
                <span>{user.name}</span><span>{user.lastname}</span>
            </div>
            <p className="text-xs lowercase">{user.email}</p>
            </div>
        </div>
    );
}