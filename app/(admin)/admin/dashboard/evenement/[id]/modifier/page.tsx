import { notFound } from "next/navigation";
import EventForm from "@/src/features/events/components/admin/EventForm";
import { getEventById } from "@/src/features/events/dal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditEventPage({ params }: PageProps) {
    const { id } = await params;

    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/dashboard?tab=events" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux événements
                    </Link>
                </Button>
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Modifier l'événement</h1>
            </div>
            <EventForm event={event} />
        </div>
    );
}