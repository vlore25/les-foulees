import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsers, getUser } from "../../dal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

async function SeeMore({ id }: { id: string }) {
  const user = await getUser(id);

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MoreVertical size={16} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de l'utilisateur</DialogTitle>
        </DialogHeader>

        {/* Pas de .map() ici, on affiche directement les propriétés de l'objet */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="font-bold">Prénom :</div>
          <div>{user.name}</div>
          
          <div className="font-bold">Nom :</div>
          <div>{user.lastname}</div>

          {/* Si c'est un AdminUserDTO, ces champs existeront */}
          {'email' in user && (
            <>
              <div className="font-bold">Email :</div>
              <div>{user.email}</div>
              <div className="font-bold">Téléphone :</div>
              <div>{user.phone}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function UserList() {

    const users = await getAllUsers()

    return (
        <Table className="">
            <TableCaption>Liste d'utilisateur actives.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Details</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => {
                    return (
                        <TableRow key={user.id}>
                            <TableCell >{user.name}</TableCell>
                            <TableCell >{user.lastname}</TableCell>
                            <TableCell ><SeeMore id={user.id} /></TableCell>
                        </TableRow>
                    )
                })
                }
            </TableBody>
        </Table>
    )
}

