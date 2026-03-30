import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsersAdminList } from "../../dal";
import { UserRowActions } from "./UserRowActions";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminUsersList() {
  // Récupération des données via la DAL
  const usersData = await getAllUsersAdminList();

  return (
    <div className="overflow-hidden rounded-md border w-100% lg:w-100">
      <Table>
        <TableCaption>Liste des utilisateurs enregistrés.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Photo</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Enregistré depuis</TableHead>
            <TableHead className="text-right">Voir details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.length > 0 ? (
            usersData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || ""} className="object-cover" />
                    <AvatarFallback className="text-[10px] bg-primary/10">
                      {user.name[0]}{user.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>
                  {String(user.createdAt)}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/utilisateurs/${user.id}`} className="flex cursor-pointer justify-center">
                    <Eye className="mr-2 h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}