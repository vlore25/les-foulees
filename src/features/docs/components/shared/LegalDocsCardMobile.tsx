import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import LegalDocRowActions from "../admin/LegalDocRowActions";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import { getLegalDocs } from "../../dal";
import { CurrentUser } from "@/src/lib/dto";
import { getCurrentUser } from "@/src/features/users/dal";


interface LegalDocsCardMobileProps {
    isAdminPage: boolean;
}

export default async function LegalDocsCardMobile({ isAdminPage }: LegalDocsCardMobileProps) {

    const user = await getCurrentUser()
    const docs = await getLegalDocs();
    const isUserAdmin = user?.role === "ADMIN";
    const showAdminTools = isUserAdmin && isAdminPage;

    if (docs.length === 0) {
        return (
            <EmptyCategory
                emptyIcon={FileText}
                text="Aucun document disponible."
            />
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