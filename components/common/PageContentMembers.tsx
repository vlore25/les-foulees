import { ReactNode } from "react";
import { Title2 } from "../ui/title2";

interface PageContentMembersProps {
    title: string;
    pageContent: ReactNode;
}

export default function PageContentMembers({ title, pageContent }: PageContentMembersProps) {
    return (
        <section className="flex flex-col space-y-3">
            <Title2>{title}</Title2>
            {pageContent}
        </section>
    );
}