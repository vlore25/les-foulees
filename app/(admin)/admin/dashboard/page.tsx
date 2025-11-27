// app/(admin)/dashboard/page.tsx
import { getCurrentUser } from "@/app/actions/user";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  const name = user?.name || "Administrateur"; 

  return (
    <div className="p-8 space-y-6">
      {/* Utilisation de la classe text-primary définie dans globals.css */}
      <h1 className="text-4xl font-bold text-primary">Tableau de Bord Administrateur</h1>
      <p className="text-lg">
        Bienvenue dans la zone d'administration, **{name}** !
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Carte 1 */}
        <div className="p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Accéder à la liste des membres et des invitations.</p>
        </div>
        
        {/* Carte 2 */}
        <div className="p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-xl font-semibold">Événements</h2>
          <p className="text-muted-foreground">Créer, modifier ou supprimer des événements.</p>
        </div>
        
        {/* Carte 3 */}
        <div className="p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-xl font-semibold">Paramètres</h2>
          <p className="text-muted-foreground">Modifier les configurations globales du club.</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        **Test de Routage Réussi :** Si vous voyez cette page, l'accès à **`/admin/dashboard`** est validé pour l'administrateur.
      </p>
    </div>
  );
}