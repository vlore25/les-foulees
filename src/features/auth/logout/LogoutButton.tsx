"use client"

import { logout } from "@/src/features/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";


export default function LogoutButton() {
    return (
        <Button
            variant="ghost"
            size="responsive"
            className="bg-transparent text-red-600"
            onClick={() => logout()}>
            Se déconnecter
            <LogOut color="red"/>
        </Button>
    );
}
