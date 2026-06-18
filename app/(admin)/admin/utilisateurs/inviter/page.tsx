import { Title2 } from "@/components/ui/title2";
import InviteForm from "@/src/features/users/invite/InviteForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvitePage() {
    return (
        <div className='flex flex-col space-y-6 w-full'>
            <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-md text-slate-400 hover:text-primary hover:bg-slate-100">
                    <Link href="/admin/utilisateurs">
                        <ArrowLeft size={20} />
                    </Link>
                </Button>
                <Title2>Inviter un nouveau membre</Title2>
            </div>
            
            <div className="bg-white p-6 rounded-md border border-slate-200 max-w-2xl">
                <InviteForm />
            </div>
        </div>
    );
}
