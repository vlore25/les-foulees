import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLegalDocById } from "@/src/features/docs/dal";
import LegalDocForm from "@/src/features/docs/components/admin/LegalDocsForm";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditLegalDocPage({ params }: PageProps) {
    const { id } = await params;

    const legalDoc = await getLegalDocById(id);

    if (!legalDoc) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/documents" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux documents
                    </Link>
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Modifier le document</h1>
            </div>
            <LegalDocForm doc={legalDoc} />
        </div>
    );
}