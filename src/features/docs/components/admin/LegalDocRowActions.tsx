"use client";

import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteLegalDocAction } from "../../docs.actions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function LegalDocRowActions({ docId }: { docId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Supprimer ce document ?")) {
      startTransition(async () => {
        await deleteLegalDocAction(docId);
      });
    }
  };

  return (
    <>
      {/* --- VERSION MOBILE (Dropdown) ---*/}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Action Editer */}
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/evenement/${docId}/modifier`} className="cursor-pointer w-full flex items-center">
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
      </div>
      {/* --- VERSION DESKTOP (Boutons) --- */}
      <div className="hidden lg:flex gap-1">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/dashboard/document/${docId}/modifier`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
}