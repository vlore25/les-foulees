import { getAllevents } from "../dal";
import EventsCardMobile from "../shared/EventsCardMobile";

export default async function EventListPublic(){
    const events = await getAllevents();
    return (
        <div>
            <EventsCardMobile events={events}/>
        </div>

    );
}