import { InscriptionFeature } from "@/src/features/auth/inscription/components/inscription-feature";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function InscriptionPage({ searchParams }: PageProps) {
    
    const token = typeof searchParams.token === "string" ? searchParams.token : undefined;

    return (
        <main className="mx-auto h-full my-20">
            <InscriptionFeature token={token}/>
        </main>
    );
}