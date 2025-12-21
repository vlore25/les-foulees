"use client"

import { UserDTO } from "@/src/lib/dto"
import { ColumnDef } from "@tanstack/react-table"

export const columnsUsers: ColumnDef<UserDTO>[] = [
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
    accessorKey: "createdAt",
    header: "Enregistré depuis",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString("fr-FR")
    },
  },

]