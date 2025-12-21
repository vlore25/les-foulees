import EventListPublic from "@/src/features/events/components/public/EventListPublic";


export default function EventsPage(){
    return(
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Événements</h3>
            </div>
            <EventListPublic />
        </div>
    );

}