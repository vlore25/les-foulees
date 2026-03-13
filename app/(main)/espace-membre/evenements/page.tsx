import PageContentMembers from "@/components/common/PageContentMembers";
import EventListPublic from "@/src/features/events/public/EventListPublic";

export default function EventsPage() {
    return (
        <PageContentMembers
            title="Événements"
            pageContent={<EventListPublic />}
        />

    );

}