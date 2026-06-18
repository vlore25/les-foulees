import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, ChevronRight } from "lucide-react";
import LegalDocRowActions from "../admin/LegalDocRowActions";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import { getLegalDocs } from "../../dal";
import { getCurrentUser } from "@/src/features/users/dal";
import { Badge } from "@/components/ui/badge";
import { TypographyH3, TypographyP, TypographyDetail } from "@/components/ui/typography";


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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {docs.map((doc) => (
                <Card 
                    key={doc.id} 
                    className="group flex flex-col h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white rounded-tl-[2rem] rounded-br-[2rem]"
                >
                    <div className="relative h-40 w-full overflow-hidden bg-primary/5 flex items-center justify-center">
                        <FileText size={64} className="text-primary/20 transition-transform duration-500 group-hover:scale-110" />
                        
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm border-none font-bold uppercase tracking-wider text-[10px]">
                                Document Officiel
                            </Badge>
                        </div>

                        {showAdminTools &&
                            <div className="absolute top-4 right-4">
                                <LegalDocRowActions docId={doc.id} />
                            </div>
                        }

                        <div className="absolute bottom-4 left-6 right-6">
                            <TypographyH3 className="line-clamp-2">
                                {doc.title}
                            </TypographyH3>
                        </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow space-y-4">
                        <TypographyP className="line-clamp-3 italic">
                            {doc.description || "Aucune description pour ce document."}
                        </TypographyP>

                        <div className="pt-4 mt-auto border-t border-primary/5 flex justify-end">
                            {doc.Url ? (
                                <a 
                                    href={doc.Url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm group/link"
                                >
                                    <span>Télécharger</span>
                                    <div className="p-1.5 rounded-full bg-primary/5 group-hover/link:bg-primary group-hover/link:text-white transition-all">
                                        <Download size={18} />
                                    </div>
                                </a>
                            ) : (
                                <TypographyDetail>Indisponible</TypographyDetail>
                            )}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
