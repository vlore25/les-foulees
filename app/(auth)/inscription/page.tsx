import { InscriptionFeature } from "@/src/features/auth/components/Registration";

type Params = Promise<{ token?: string }>;

export default async function InscriptionPage({ searchParams }: { searchParams: Params }) {
    
    const params = await searchParams;

    return (
        <main className="mx-auto h-full my-10">
            <InscriptionFeature token={params.token}/>
        </main>
    );
}