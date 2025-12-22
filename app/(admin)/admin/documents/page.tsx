import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LegalDocForm from "@/src/features/docs/components/admin/LegalDocsForm";
import LegalDocsList from "@/src/features/docs/components/admin/LegalDocsList";

export default function documentsPage() {

    const tabsContent = [
        {
            name: 'Gestion de documents',
            value: 'user-gestion',
            content: (
                <LegalDocsList />
            )
        },
        {
            name: 'Ajouter un document',
            value: 'invite',
            content: (
                <LegalDocForm />
            )
        },
    ]

    return (
        <div className='w-full'>
            <h3>Gestion des documents administratifs</h3>
            <Tabs defaultValue='user-gestion' className='gap-4'>
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