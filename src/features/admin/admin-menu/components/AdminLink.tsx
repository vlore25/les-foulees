import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrickWallShield } from "lucide-react";

export function AdminLink() {
  return (
    <Button variant="ghost" size="sm" asChild className="gap-2">
      <Link href="/admin/dashboard">
        <BrickWallShield className="size-4" />
        <span>Espace Admin</span>
      </Link>
    </Button>
  );
}