import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsersTable from "@/src/features/users/admin/user-gestion/AdminUsersTable";
import InviteForm from "@/src/features/users/invite/InviteForm";

export default function UsersPage() {
  //Tabs elements
  const tabsContent = [
    {
      name: 'Gestion de utilisateurs',
      value: 'user-gestion',
      content: (
        <AdminUsersTable />
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
    <div className='w-full max-w-md'>
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