import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLegalDocById } from "@/src/features/docs/dal";
import LegalDocForm from "@/src/features/docs/components/admin/LegalDocsForm";
import { getEventById } from "@/src/features/events/dal";
import EventForm from "@/src/features/events/components/admin/EventForm";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params;

    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    return (
        <div>
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/evenements" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux evenements
                    </Link>
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Modifier le evenement</h1>
            </div>
            <EventForm event={event} />
        </div>
    );
}