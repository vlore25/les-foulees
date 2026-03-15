import { ReactNode } from "react";
import { Title2 } from "../ui/title2";

interface PageContentAdminProps {
    title: string;
    children: ReactNode; 
}

export default function PageContentAdmin({ title, children }: PageContentAdminProps) {
    return (
        <section className="px-1 flex flex-col space-y-3">
            <Title2>{title}</Title2>
            {children}
        </section>
    );
}