"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import LegalDocRowActions from "../admin/LegalDocRowActions";
import { LegalDocs } from "@/app/generated/prisma/client";
import { useUser } from "@/components/providers/UserProvider";
import { usePathname } from "next/navigation";

interface LegalDocsCardMobileProps {
    docs: LegalDocs[];
}

export default function LegalDocsCardMobile({ docs }: LegalDocsCardMobileProps) {
    const user = useUser();
    const pathname = usePathname();

    const isUserAdmin = user?.role === "ADMIN";
    const isAdminPage = pathname?.includes("/admin");
    const showAdminTools = isUserAdmin && isAdminPage;

    if (docs.length === 0) {
        return (
            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                Aucun document disponible.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:grid grid-cols-4 lg:gap-12">
            {docs.map((doc) => (
                <Card key={doc.id} className="shadow-sm py-2">
                    <CardHeader className="px-2">
                        {showAdminTools &&
                            <div className="flex flex-row justify-end">
                                <LegalDocRowActions docId={doc.id} />
                            </div>
                        }
                    </CardHeader>
                    <CardTitle className="text-base font-semibold text-center">
                        {doc.title}
                    </CardTitle>

                    <CardContent className="text-center ">
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {doc.description || "Aucune description pour ce document."}
                        </p>
                    </CardContent>

                    <CardFooter className="border-t bg-muted/20">
                        {doc.Url ? (
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
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