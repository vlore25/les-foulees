import { getAllevents } from "../dal";
import AdminEventCardList from "./AdminEventCardList";

export default async function EventList() {

    const events = await getAllevents();

    return (
        <div className="w-full">
            <AdminEventCardList events={events} />
        </div>
    );
}