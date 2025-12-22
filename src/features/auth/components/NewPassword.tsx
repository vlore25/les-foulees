import { verifyRecoveryToken } from "@/src/features/auth/auth.actions"; 
import Image from "next/image";
import hero from '@/public/images/login-hero.jpg'; 
import ErrorCard from "@/components/common/feedback/ErrorCard"; 
import FouleesLogo from "@/components/common/logo/FouleesLogo"; 
import ResetPasswordForm from "./forms/ResetPasswordForm";

interface NewPasswordProps {
    token: string;
}

export default async function NewPassword({ token }: NewPasswordProps) {

    const existingToken = await verifyRecoveryToken(token);
    console.log(existingToken)
    return (
        <main className='
            flex flex-col w-full max-w-md mx-auto my-10 bg-white shadow-2xl rounded-2xl overflow-hidden
            lg:grid lg:grid-cols-2 lg:max-w-5xl lg:min-h-[600px]
        '>
            <div className='flex flex-col items-center justify-center w-full p-6 py-10 lg:p-12 gap-6'>
                
                <FouleesLogo size={140} className="w-[100px] lg:w-[140px]" />

                {!existingToken ? (
                    <ErrorCard
                        title="Lien invalide"
                        message="Désolé, ce lien a expiré, n'existe pas, ou a déjà été utilisé."
                        link="/recuperation"
                        linkMessage="Demander un nouveau lien"
                    />
                ) : (
                    <ResetPasswordForm token={token} />
                )}
            </div>
            <div className='hidden lg:flex relative bg-gray-900'>
                <Image
                    src={hero}
                    alt="Image de fond"
                    fill
                    className="object-cover opacity-90"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
        </main>
    );
}