import { getAllevents } from "../../dal";
import EventsCardMobile from "./EventsCardMobile";

export default async function EventList(){
    const events = await getAllevents();
    return (
        <div>
            <EventsCardMobile events={events} />
        </div>

    );
}