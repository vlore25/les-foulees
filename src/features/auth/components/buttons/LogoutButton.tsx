"use client"

import { logout } from "@/src/features/auth/auth.actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";


export default function LogoutButton() {
    return (
        <Button
            variant="ghost"
            size="responsive"
            className=" text-red-600"
            onClick={() => logout()}>
            <span>Se déconnecter</span>
            <LogOut color="red"/>
        </Button>
    );
}
