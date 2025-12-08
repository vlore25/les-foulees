import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import LegalDocRowActions from "./LegalDocRowActions";
import { LegalDocs } from "@/app/generated/prisma/client";

interface LegalDocsCardMobileProps {
    docs: LegalDocs[];
}

export default function LegalDocsCardMobile({ docs }: LegalDocsCardMobileProps) {
    if (docs.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                Aucun document disponible.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {docs.map((doc) => (
                <Card key={doc.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <CardTitle className="text-base font-semibold line-clamp-1">
                                    {doc.title}
                                </CardTitle>
                            </div>
                            <div className="flex flex-row justify-between">
                                <LegalDocRowActions docId={doc.id} />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {doc.description || "Aucune description pour ce document."}
                        </p>
                    </CardContent>

                    <CardFooter className="pt-2 border-t bg-muted/20">
                        {doc.Url ? (
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start gap-2">
                                <a href={doc.Url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4" />
                                    Télécharger le document
                                </a>
                            </Button>
                        ) : (
                            <p className="text-xs text-muted-foreground py-2">Fichier non disponible</p>
                        )}
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}