import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventList from "@/src/features/events/admin/EventList";
import EventForm from "@/src/features/events/admin/forms/EventForm";

export default function eventsPage() {

    const tabsContent = [
            {
                name: "Événements",
                value: 'events',
                content: (
                    <EventList />
                )
            },
            {
                name: 'Nouveau événement',
                value: 'event-add',
                content: (
                    <EventForm />
                )
            },
        ]

    return (
        <div className='w-full'>
            <h3>Gestion des evenements</h3>
            <Tabs defaultValue='events' className='gap-4'>
                <TabsList className='bg-background'>
                    {/** Tabs Buttons*/}
                    {tabsContent.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {/** Tabs content will render here*/}
                {tabsContent.map(tab => (
                    <TabsContent key={tab.value} value={tab.value}>
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}