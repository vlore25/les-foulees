import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import LegalDocRowActions from "./LegalDocRowActions"; 
import { LegalDocs } from "@/prisma/generated/prisma/client";

interface LegalDocsTableDesktopProps {
  docs: LegalDocs[];
}

export default function LegalDocsTableDesktop({ docs }: LegalDocsTableDesktopProps) {
  return (
    <div className="border rounded-md shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Fichier</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                Aucun document trouvé.
              </TableCell>
            </TableRow>
          ) : (
            docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {doc.title}
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate" title={doc.description || ""}>
                    {doc.description || <span className="text-muted-foreground italic">Aucune description</span>}
                </TableCell>
                <TableCell>
                  {doc.Url ? (
                    <a
                      href={doc.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                    >
                      <Download className="h-3 w-3" />
                      Télécharger
                    </a>
                  ) : (
                    <span className="text-muted-foreground text-sm">Non disponible</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <LegalDocRowActions docId={doc.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}