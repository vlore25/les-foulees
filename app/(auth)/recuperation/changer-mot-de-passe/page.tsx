import NewPassword from "@/src/features/auth/components/NewPassword";

interface PageProps {
    searchParams: { token: string }
}

export default async function NewPasswordPage({ searchParams }: PageProps){
    const token = (await searchParams).token;

    return (
        <NewPassword token={token}/>
    );
}