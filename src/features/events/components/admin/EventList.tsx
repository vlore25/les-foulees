import { getAllevents } from "../../dal";
import EventsCardMobile from "./EventsCardMobile";
import EventsTableDesktop from "./EventsTableDesktop";

export default async function EventList(){
    const events = await getAllevents();
    return (
        <div>
            <EventsCardMobile events={events} />
            <EventsTableDesktop events={events} />
        </div>

    );
}