import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsersList from "@/src/features/users/admin/user-gestion/AdminUsersList";
import InviteForm from "@/src/features/users/invite/InviteForm";

export default function UsersPage() {
  //Tabs elements
  const tabsContent = [
    {
      name: 'Gestion de utilisateurs',
      value: 'user-gestion',
      content: (
        <AdminUsersList />
      )
    },
    {
      name: 'Inviter',
      value: 'invite',
      content: (
        <InviteForm />
      )
    },
  ]
  return (
    <div className='w-full'>
      <h3>Gestion des utilisateurs</h3>
      <Tabs defaultValue='user-gestion' className='gap-4'>
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