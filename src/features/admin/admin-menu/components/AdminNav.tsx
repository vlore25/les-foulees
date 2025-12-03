import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AdminNavItems from "./AdminNavItems";
import Link from "next/link";

export default function AdminNav() {
    return (
        <div className="px-4">
            <h4>Administration</h4>
            <Accordion type="single" collapsible className="w-full flex flex-col gap-2 mt-3">
                {AdminNavItems.map((item) =>
                    item.subItems ? (
                        <AccordionItem key={item.title} value={item.title}>
                            <AccordionTrigger>
                                <div className="flex flex-row gap-4 items-center">
                                    {item.icon}
                                    <Link href={item.href}>{item.title}</Link>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <ul className="pl-4 flex flex-col gap-1">
                                    {item.subItems.map((subItem) => (
                                        <li key={subItem.title}>
                                            <div className="flex flex-row gap-4 items-center">
                                                {subItem.icon}
                                                <Link href={subItem.href}>{subItem.title}</Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ) :
                        <AccordionItem key={item.title} value={item.title}>
                            <div className="flex flex-row gap-4 items-center">
                                {item.icon}
                                <Link href={item.href}>{item.title}</Link>
                            </div>
                        </AccordionItem>
                )}
            </Accordion>
        </div >
    );
}