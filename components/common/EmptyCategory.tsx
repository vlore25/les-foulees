import { FileText } from "lucide-react";

export default function EmptyCategory() {
    return (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-slate-50 text-muted-foreground">
            <FileText className="w-10 h-10 mb-2 opacity-50" />
            <p>Aucun element dans cette catégorie.</p>
        </div>
    );
}