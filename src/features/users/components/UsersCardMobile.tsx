"use client"

import { UserDTO } from "@/src/lib/dto";
import { ChevronDown, Mail, Phone} from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface UserProps {
    users: UserDTO[];
}

export default function UsersCardsMobile({ users }: UserProps) {
    return (
        <div className="flex flex-col gap-3 lg:hidden pb-10">
            {users.map((user) => (
                <UserMobileCard key={user.id} user={user} />
            ))}
        </div>
    );
}

function UserMobileCard({ user }: { user: UserDTO }) {
    const [isOpen, setIsOpen] = useState(false);

    const email = "email" in user ? user.email : "Non renseigné";
    const phone = "phone" in user && user.phone ? user.phone : "Non renseigné";
    

    return (
        <Collapsible
            open={isOpen} 
            onOpenChange={setIsOpen}
            className="bg-white border rounded-lg shadow-sm overflow-hidden"
        >
            <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">

                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-base">
                                {user.name} {user.lastname}
                            </span>
                        </div>
                    </div>

                    <ChevronDown className={cn(
                        "h-5 w-5 text-gray-400 transition-transform duration-200 shrink-0",
                        isOpen && "rotate-180"
                    )} />
                </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
                <div className="bg-gray-50/50 border-t px-4 py-3 space-y-3 text-sm animate-in slide-in-from-top-1">

                    <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group">
                        <div className="bg-white p-2 rounded-full border shadow-sm group-hover:border-primary/30 transition-colors">
                            <Mail className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                        </div>
                        <span className="truncate font-medium">{email}</span>
                    </a>

                    <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group">
                        <div className="bg-white p-2 rounded-full border shadow-sm group-hover:border-primary/30 transition-colors">
                            <Phone className="h-4 w-4 text-gray-500 group-hover:text-primary" />
                        </div>
                        <span className="font-medium">{phone}</span>
                    </a>

                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}