"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { LegalDocs } from "@/app/generated/prisma/client";
import { createLegalDocAction, updateLegalDocAction } from "../../docs.actions";
import { LegalDocFormState } from "@/src/lib/definitions";

interface LegalDocFormProps {
  doc?: LegalDocs | null;
}

export default function LegalDocForm({ doc }: LegalDocFormProps) {
  const actionToUse = doc 
    ? updateLegalDocAction.bind(null, doc.id) 
    : createLegalDocAction;

  const [state, action, pending] = useActionState<LegalDocFormState, FormData>(actionToUse, undefined);

  return (
    <form action={action} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Titre du document</label>
        <Input id="title" name="title" defaultValue={doc?.title || ""} placeholder="Ex: Certificat médical de non contre-indication " />
        {state?.error?.title && <p className="text-red-500 text-xs">{state.error.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <Textarea id="description" name="description" defaultValue={doc?.description || ""} placeholder="Description optionnelle..." />
        {state?.error?.description && <p className="text-red-500 text-xs">{state.error.description[0]}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium">Fichier PDF {doc && "(Laisser vide pour garder l'actuel)"}</label>
        <Input id="file" name="file" type="file" accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp" />
        {state?.error?.file && <p className="text-red-500 text-xs">{state.error.file[0]}</p>}
        {doc?.Url && <p className="text-xs text-muted-foreground mt-1">Fichier actuel : <a href={doc.Url} target="_blank" className="underline text-primary">Voir le document</a></p>}
      </div>

      {state?.message && (
        <p className={`text-sm p-2 rounded ${state.message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement..." : (doc ? "Modifier" : "Ajouter le document")}
      </Button>
    </form>
  );
}