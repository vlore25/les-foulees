import {  LucideIcon } from "lucide-react";

interface EmptyCategoryProps{
    emptyIcon: LucideIcon;
    text: string
}

export default function EmptyCategory({emptyIcon: EmptyIcon, text}: EmptyCategoryProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-slate-50 text-muted-foreground">
            <EmptyIcon className="w-10 h-10 mb-2 opacity-50" />
            {text}
        </div>
    );
}