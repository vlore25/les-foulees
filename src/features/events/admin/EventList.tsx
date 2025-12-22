import { getAllevents } from "../../dal";
import EventsTableDesktop from "./EventsTableDesktop";

export default async function EventList() {

    const events = await getAllevents();

    return (
        <EventsTableDesktop events={events} />
    );
}