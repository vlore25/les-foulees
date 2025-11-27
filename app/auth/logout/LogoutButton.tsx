"use client"

import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

 
export default function LogoutButton(){
    return(
        <Button 
        onClick={() => logout()}
        ><LogOut/>
        Se déconnecter
        </Button>
    );
}
