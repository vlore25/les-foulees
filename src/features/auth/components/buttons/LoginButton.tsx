import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginButton() {
    return (
        <Button asChild className="w-50 self-center">
            <Link href='/login'>
                <span>
                    Connexion
                </span>
            </Link>
        </Button>
    );
}

