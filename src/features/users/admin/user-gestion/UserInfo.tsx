import { AdminUserDTO } from "@/src/lib/dto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserInfoProps {
  userData: AdminUserDTO;
}

export default function UserInfo({ userData }: UserInfoProps) {
  // Formatage de la date pour un affichage "Français"
  const formattedBirthdate = userData.birthdate 
    ? new Date(userData.birthdate).toLocaleDateString("fr-FR") 
    : "Non renseignée";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {userData.name} {userData.lastname}
          </CardTitle>
          <div className="flex gap-2">
            {/* Badge pour le Rôle */}
            <Badge variant={userData.role === "ADMIN" ? "destructive" : "secondary"}>
              {userData.role}
            </Badge>
            {/* Badge pour le Statut */}
            <Badge variant={userData.status === "ACTIVE" ? "default" : "outline"}>
              {userData.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Colonne 1 : Infos Personnelles */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
              <p className="text-sm font-mono bg-muted p-1 rounded">{userData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date de naissance</p>
              <p className="text-base">{formattedBirthdate}</p>
            </div>
          </div>

          {/* Colonne 2 : Coordonnées */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{userData.email || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
              <p className="text-base">{userData.phone || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visibilité Annuaire</p>
              <p className="text-sm italic">
                {userData.showPhoneDirectory ? "Visible" : "Masqué"}
              </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}