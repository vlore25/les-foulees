import { getAllevents } from "@/src/features/events/dal";
import { Title } from "@/components/ui/title";
import EventListVisitor from "@/components/PageComp/EventsPagComp/EventListVisiteur";
import { Quote } from "@/components/ui/quote";

export default async function EventsVisitorPage() {
    // On utilise ton DAL existant pour récupérer tous les événements
    const events = await getAllevents();

    return (
        <main className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
            <div className="space-y-2 mb-10">
                <Title>Le calendrier des événements</Title>
                <Quote>
                    Retrouvez les rendez-vous passés et à venir des Foulées Avrillaises.
                </Quote>                  
            </div>
            {/* Ce composant va gérer les boutons "Futurs / Passés" */}
            <EventListVisitor events={events} />
        </main>
    );
}