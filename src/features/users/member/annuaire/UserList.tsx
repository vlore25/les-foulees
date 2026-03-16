import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsersPublicList, getUserDetailsPublic } from "../../dal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

// Ce composant reste un Server Component qui récupère les détails à la demande
async function SeeMore({ id }: { id: string }) {
  const user = await getUserDetailsPublic(id);

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du membre</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
          <div className="font-bold text-muted-foreground">Prénom :</div>
          <div>{user.name}</div>

          <div className="font-bold text-muted-foreground">Nom :</div>
          <div>{user.lastname}</div>

          <div className="font-bold text-muted-foreground">Téléphone :</div>
          <div>{user.phone || "Non renseigné"}</div>

          <div className="font-bold text-muted-foreground">Email :</div>
          <div>{user.email || "Non renseigné"}</div>

          <div className="font-bold text-muted-foreground">Inscription :</div>
          <div>
            {user.createdAt 
              ? new Date(user.createdAt).toLocaleDateString('fr-FR') 
              : "Date inconnue"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function UserList() {
  const users = await getAllUsersPublicList();

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Annuaire des membres actifs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead className="text-right">Informations</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((user) => user.status === "ACTIVE")
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell className="text-right">
                  <SeeMore id={user.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}