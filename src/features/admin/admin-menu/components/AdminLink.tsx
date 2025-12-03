import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Columns3Cog } from "lucide-react";

export function AdminLink() {
  return (
    <Button variant="ghost" size="sm" asChild className="gap-2">
      <Link href="/admin/dashboard">
        <Columns3Cog className="size-4"/>
        <span className="hidden">Espace Admin</span>
      </Link>
    </Button>
  );
}