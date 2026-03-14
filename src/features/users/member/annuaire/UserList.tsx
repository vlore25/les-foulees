import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsersPublicList, getUserDetailsPublic } from "../../dal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

async function SeeMore({ id }: { id: string }) {

  const user = await getUserDetailsPublic(id);

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
          <DialogTitle>Détails du membre</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="font-bold">Prénom :</div>
          <div>{user.name}</div>

          <div className="font-bold">Nom :</div>
          <div>{user.lastname}</div>

          <div className="font-bold">Teléphone :</div>
          {user.phone ? <div>{user.phone}</div> : 'No reisegné'}

          <div className="font-bold">Email :</div>
          {user.email ? <div>{user.email}</div> : 'No reisegné'}

          <div className="font-bold">Date d'inscription :</div>
          <div>{user.createdAt}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default async function UserList() {

  const users = await getAllUsersPublicList()

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

