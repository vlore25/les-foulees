import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorCardProps{
    title: string
    message: string
    link: string
    linkMessage: string
}
export default function ErrorCard({title, message, link, linkMessage}: ErrorCardProps) {
    return (
        <Card className="w-full max-w-md border-red-200 bg-red-50 shadow-none">
            <CardHeader>
                <CardTitle className="text-red-700 text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col text-center space-y-2">
                {message}
                <Link href={link} className="text-sm font-semibold text-red-800 underline hover:text-red-900 hover:no-underline transition-all">{linkMessage}</Link>
            </CardContent>
        </Card>
    );
}