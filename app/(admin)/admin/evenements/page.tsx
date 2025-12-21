import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventForm from "@/src/features/events/components/admin/EventForm";
import EventList from "@/src/features/events/components/admin/EventList";

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
                            className='data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 data-[state=active]:shadow-none dark:data-[state=active]:border-transparent'
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