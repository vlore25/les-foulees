import { Card } from "@/components/ui/card";
import { Title } from "@/components/ui/title";
import { getEventsCountCurrentYear } from "@/src/features/events/dal";
import { getUsersCount } from "@/src/features/users/dal";
import { cn } from "@/src/lib/utils";
import { Cake, Calendars, Users } from "lucide-react";

export default async function SocialProof() {
    const eventsOfYears = await getEventsCountCurrentYear();
    const userCount = await getUsersCount();
    const clubYears = (new Date().getFullYear() - 2018);

    const socials = [
        {
            number: eventsOfYears,
            text: `Événements en ${new Date().getFullYear()}`,
            icon: Calendars
        },
        {
            number: userCount,
            text: "Membres Actifs",
            icon: Users
        },
        {
            number: clubYears,
            text: "Années d'existence",
            icon: Cake
        }
    ];

    return (
        <section className="my-16 max-w-6xl mx-auto px-4">
            <Title>
                L'association en quelques chiffres
            </Title>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {socials.map((item, index) => {
                    const IconTag = item.icon;
                    return (
                        <Card
                            key={index}
                            className={cn(
                                "relative overflow-hidden p-8 shadow-lg border-0",
                                "rounded-none rounded-tl-[2.5rem] rounded-br-[2.5rem]",
                                "bg-primary-50 group hover:bg-primary-100 transition-colors duration-500"
                            )}
                        >
                            <IconTag
                                className="absolute -right-4 -bottom-4 w-32 h-32 text-primary-200/40 -rotate-12 group-hover:rotate-0 transition-transform duration-700"
                                aria-hidden="true"
                            />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-primary-500 rounded-tl-xl rounded-br-xl shadow-md">
                                        <IconTag className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-5xl font-black text-primary-700 tracking-tighter">
                                        {item.number}
                                    </span>
                                </div>

                                <p className="font-bold text-primary-600 uppercase tracking-wide text-sm sm:text-base italic">
                                    {item.text}
                                </p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}