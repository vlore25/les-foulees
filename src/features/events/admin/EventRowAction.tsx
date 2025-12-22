"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTransition } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { deleteEventAction } from "../../events.actions";
import { useUser } from "@/components/providers/UserProvider";

export function EventRowActions({ eventId }: { eventId: string }) {
    const user = useUser();
    const isAdmin = user?.role === "ADMIN";
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet evenement?")) {
            startTransition(async () => {
                await deleteEventAction(eventId);
            });
        }
    };

    if (!isAdmin) return null;
    return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir menu</span>
                            <MoreVertical className="h-4 w-4 text-black" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Action Editer */}
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/evenements/${eventId}`} className="cursor-pointer w-full flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Modifier</span>
                            </Link>
                        </DropdownMenuItem>

                        {/* Action Supprimer */}
                        <DropdownMenuItem
                            onClick={handleDelete}
                            disabled={isPending}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
    );
}