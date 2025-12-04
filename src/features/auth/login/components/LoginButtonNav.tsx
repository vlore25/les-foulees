import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
    return (
        <Button variant="ghost" asChild>
            <Link href='/login'>
                <LogIn className="size-6" />
                <span className="hidden md:block">
                    Connexion
                </span>
            </Link>
        </Button>
    );
}
