import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRightIcon, Menu, X } from "lucide-react";
import navItems from "./NavItems";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import LoginButton from "@/src/features/auth/components/buttons/LoginButton";

const MobileMenu = () => {
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
                        <LoginButton />
                        {navItems.map((item) =>
                            item.subItems ? (
                                <AccordionItem key={item.title} value={item.title}>
                                    <AccordionTrigger>{item.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="pl-4 flex flex-col gap-1 text-xl">
                                            {item.subItems.map((subItem) => (
                                                <SheetClose asChild>
                                                    <li key={subItem.title}>
                                                        <div className="flex flex-row gap-4 items-center ">
                                                            <Link href={subItem.href}>{subItem.title}</Link>
                                                            <ChevronRightIcon className="text-muted-foreground size-5 " />
                                                        </div>
                                                    </li>
                                                </SheetClose>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ) :
                                <AccordionItem key={item.title} value={item.title}>
                                    <SheetClose asChild>
                                        <Link href={item.href}>
                                            <div className="flex flex-row justify-between items-center">

                                                {item.title}
                                                <ChevronRightIcon className="text-muted-foreground size-5" />
                                            </div>
                                        </Link>
                                    </SheetClose>
                                </AccordionItem>
                        )}
                </Accordion>

            </SheetContent>

        </Sheet>
        </div >
    );
}

export default MobileMenu;