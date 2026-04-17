import LoginForm from "@/src/features/auth/components/forms/LoginForm";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";

export default async function LoginPage(){
    const session = await getSession();
    
    if (session?.isAuth) {
        redirect('/espace-membre/annuaire');
    }

    return(
        <LoginForm />
    );
}