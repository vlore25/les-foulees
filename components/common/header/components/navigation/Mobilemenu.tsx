import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRightIcon, Menu } from "lucide-react";
import navItems from "./NavItems";
import Link from "next/link";
import { Accordion } from "@radix-ui/react-accordion";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const MobileMenu = () => {
    return (
        <div className="lg:hidden">
            <Sheet >
                <SheetTrigger>
                    <Menu />
                </SheetTrigger>
                <SheetContent>
                    <SheetTitle className="sr-only">menu</SheetTitle>
                    <Accordion type="single" collapsible className="w-full flex flex-col gap-2 mt-9 p-4">
                        {navItems.map((item) =>
                            item.subItems ? (
                                <AccordionItem key={item.title} value={item.title}>
                                    <AccordionTrigger>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="pl-4 flex flex-col gap-1">
                                            {item.subItems.map((subItem) => (
                                                <li key={subItem.title}>
                                                    <div className="flex flex-row gap-4 items-center">
                                                        <Link href={subItem.href}>{subItem.title}</Link>
                                                        <ChevronRightIcon className="text-muted-foreground size-3 " />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ) :
                                <AccordionItem key={item.title} value={item.title}>
                                    <div className="flex flex-row gap-4 items-center">
                                        <Link href={item.href}>{item.title}</Link>
                                        <ChevronRightIcon className="text-muted-foreground size-3 " />
                                    </div>
                                </AccordionItem>
                        )}
                    </Accordion>
                </SheetContent>

            </Sheet>
        </div>
    );
}

export default MobileMenu;