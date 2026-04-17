"use client";

import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRightIcon, Menu } from "lucide-react";
import navItems from "./NavItems";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const MobileMenu = ({ portalButton }: { portalButton: React.ReactNode }) => {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost">
                        <Menu className="size-7" />
                    </Button>
                </SheetTrigger>
                <SheetContent side='left'>
                    <SheetTitle className="sr-only">menu</SheetTitle>
                    <Accordion type="single" collapsible className="w-full flex flex-col gap-4 mt-9 p-4 font-semibold text-xl">
                        {portalButton}
                        {navItems.map((item) =>
                            item.subItems ? (
                                <AccordionItem key={item.title} value={item.title} className="border-none">
                                    <AccordionTrigger className="hover:no-underline py-2">{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="pl-4 flex flex-col gap-4 text-xl mt-2">
                                            {item.subItems.map((subItem) => (
                                                <SheetClose asChild key={subItem.title}>
                                                    <li>
                                                        <Link href={subItem.href} className="flex flex-row justify-between items-center w-full">
                                                            <span>{subItem.title}</span>
                                                            <ChevronRightIcon className="text-muted-foreground size-5 " />
                                                        </Link>
                                                    </li>
                                                </SheetClose>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ) :
                                <div key={item.title} className="py-2">
                                    <SheetClose asChild>
                                        <Link href={item.href} className="flex flex-row justify-between items-center w-full">
                                            {item.title}
                                            <ChevronRightIcon className="text-muted-foreground size-5" />
                                        </Link>
                                    </SheetClose>
                                </div>
                        )}
                </Accordion>

            </SheetContent>

        </Sheet>
        </div >
    );
}

export default MobileMenu;