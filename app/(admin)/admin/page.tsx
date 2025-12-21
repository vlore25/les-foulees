import { getCurrentUser } from "@/src/features/users/dal";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== 'ADMIN'){
    redirect('/espace-membre')
  }

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto">
      <h2>Administration du site</h2>
    </div>
  );
}