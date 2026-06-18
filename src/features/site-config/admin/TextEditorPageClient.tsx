"use client";

import { useState } from "react";
import { TiptapEditor } from "@/components/ui/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { updateSiteConfigAction } from "../actions";
import Link from "next/link";
import { TypographyH1, TypographyPageDescription } from "@/components/ui/typography";

export function TextEditorPageClient({ 
    initialContent, 
    field, 
    title, 
    description 
}: { 
    initialContent: string, 
    field: "privacyPolicy" | "legalNotice",
    title: string,
    description: string
}) {
    const [content, setContent] = useState(initialContent);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        
        const payload = field === "privacyPolicy" 
            ? { privacyPolicy: content } 
            : { legalNotice: content };

        const res = await updateSiteConfigAction(payload);
        
        setSaving(false);
        if (res.success) {
            toast.success("Modifications enregistrées avec succès !");
        } else {
            toast.error("Erreur lors de l'enregistrement.");
        }
    };

    return (
        <div className="space-y-6">
            <Link href="/admin/parametres" className="inline-flex items-center text-sm text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux paramètres
            </Link>

            <div>
                <TypographyH1>{title}</TypographyH1>
                <TypographyPageDescription>{description}</TypographyPageDescription>
            </div>

            <section className="space-y-6">
                <TiptapEditor content={content} onChange={setContent} />

                <div className="pt-4 flex flex-col gap-4 items-start">
                    <Button onClick={handleSave} disabled={saving} size="lg">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enregistrer
                    </Button>
                </div>
            </section>
        </div>
    );
}
