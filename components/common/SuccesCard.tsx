import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface SuccesCardProps {
    title: string | null | undefined;
    message: string | null | undefined; 
    link?: string
    linkMessage?: string
}
export default function SuccesCard({ title, message, link, linkMessage }: SuccesCardProps) {
    return (
        <Card className="w-full max-w-xs bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg flex flex-col items-center text-center space-y-3">
            <CardHeader>
                <CheckCircle2 className="w-10 h-10 text-green-600" />
                <CardTitle className="text-green-600 text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-center space-y-2">
                {message}
                {link && 
                <Link href={link} className="text-sm font-semibold text-green-800 underline hover:text-green-900 hover:no-underline transition-all">
                    {linkMessage}
                </Link>}
            </CardContent>
        </Card>
    );
}