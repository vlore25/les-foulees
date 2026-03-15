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

export default async function AdminUsersList() {
  // Récupération des données via la DAL
  const usersData = await getAllUsersAdminList();

  return (
    <div className="overflow-hidden rounded-md border w-100% lg:w-100">
      <Table>
        <TableCaption>Liste des utilisateurs enregistrés.</TableCaption>
        <TableHeader>
          <TableRow>
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