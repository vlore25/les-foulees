import { notFound } from "next/navigation";
import EventDetails from "@/src/features/events/public/EventDetails";
import { getEventWithParticipationStatus } from "@/src/features/events/dal";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailsPage(props: PageProps) {
    
  const params = await props.params;
  const eventId = params.slug;
  const event = await getEventWithParticipationStatus(eventId);
    
  if (!event) {
    notFound();
  }

  return (
      <EventDetails event={event}/>
  );
}