import { InscriptionFeature } from "@/src/features/auth/components/Registration";
import { getSession } from "@/src/lib/session";
import { redirect } from "next/navigation";

type Params = Promise<{ token?: string }>;

export default async function InscriptionPage({ searchParams }: { searchParams: Params }) {
    const session = await getSession();
    
    if (session?.isAuth) {
        redirect('/espace-membre/annuaire');
    }

    const params = await searchParams;

    return (
        <main className="mx-auto h-full my-10">
            <InscriptionFeature token={params.token}/>
        </main>
    );
}