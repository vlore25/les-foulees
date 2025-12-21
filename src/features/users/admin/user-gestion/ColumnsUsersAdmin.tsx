"use client"

import { AdminUserDTO } from "@/src/lib/dto"
import { ColumnDef } from "@tanstack/react-table"
import { UserRowActions } from "./UserRowActions"

export const columnsUsersAdmin: ColumnDef<AdminUserDTO>[] = [
  {
    accessorKey: "name",
    header: "Prénom",
  },
  {
    accessorKey: "lastname",
    header: "Nom de famille",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telephone",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "createdAt",
    header: "Enregistré depuis",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString("fr-FR")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
 
      return (
        <UserRowActions userId={user.id} />
      )
    },
  },

]