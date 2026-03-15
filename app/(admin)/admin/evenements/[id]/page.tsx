import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "@/src/features/events/dal";
import EventForm from "@/src/features/events/admin/forms/EventForm";
import PageContentAdmin from "@/components/common/PageContentAdmin";

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
        <PageContentAdmin title="Modifier le evenement">
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/admin/evenements" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux evenements
                    </Link>
                </Button>
            </div>
            <EventForm event={event} />
        </PageContentAdmin>
    );
}