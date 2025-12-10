import { useUser } from "@/components/providers/UserProvider";
import { getAllevents } from "../../dal";
import EventsCardMobile from "../shared/EventsCardMobile";
import EventsTableDesktop from "./EventsTableDesktop";

export default async function EventList() {

    const events = await getAllevents();

    return (
        <>
            <div className="lg:hidden">
                <EventsCardMobile events={events} />
            </div>
            <div className="hidden lg:block">
                <EventsTableDesktop events={events} />
            </div>
        </>
    );
}