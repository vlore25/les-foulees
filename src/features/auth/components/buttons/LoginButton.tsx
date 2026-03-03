import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginButton() {
    return (

        <Button asChild>
            <Link href='/login'>
                <div className="flex flex-row gap-2 text-lg items-center">
                    <span>
                        Connexion
                    </span>
                </div>
            </Link>
        </Button>
    );
}

