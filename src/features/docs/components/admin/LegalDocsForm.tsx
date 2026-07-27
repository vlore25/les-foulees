"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { FileInput } from "@/components/ui/file-input";
import { useActionState } from "react";
import { createLegalDocAction, updateLegalDocAction } from "../../docs.actions";
import { LegalDocFormState } from "@/src/lib/definitions";
import { LegalDocs } from "@/prisma/generated/client";

interface LegalDocFormProps {
  doc?: LegalDocs | null;
}

export default function LegalDocForm({ doc }: LegalDocFormProps) {
  const actionToUse = doc 
    ? updateLegalDocAction.bind(null, doc.id) 
    : createLegalDocAction;

  const [state, action, pending] = useActionState<LegalDocFormState, FormData>(actionToUse, undefined);

  return (
    <form action={action} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input id="title" name="title" defaultValue={doc?.title || ""} placeholder="Ex: Attestation de licence, Règlement intérieur..." />
        {state?.error?.title && <p className="text-red-500 text-xs">{state.error.title[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={doc?.description || ""} placeholder="Description optionnelle..." />
        {state?.error?.description && <p className="text-red-500 text-xs">{state.error.description[0]}</p>}
      </div>

      <div className="space-y-2">
        <FileInput
          id="file"
          name="file"
          accept="application/pdf, image/png, image/jpeg, image/jpg, image/webp"
          label={`Fichier PDF ${doc ? "(Laisser vide pour garder l'actuel)" : ""}`}
        />
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