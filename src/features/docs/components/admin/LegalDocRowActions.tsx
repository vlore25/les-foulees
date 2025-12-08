"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteLegalDocAction } from "../../docs.actions";

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
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/dashboard/document/${docId}/modifier`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}