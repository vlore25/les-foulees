import { Card } from "@/components/ui/card";
import { Title } from "@/components/ui/title";
import { getEventsCountCurrentYear } from "@/src/features/events/dal";
import { getUsersCount } from "@/src/features/users/dal";
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
        <section className="my-10 max-w-6xl mx-auto px-4">
            <Title >
                Notre association en quelques chiffres :
            </Title>
            <div className="flex flex-col lg:flex-row justify-between gap-6 mt-5">
                {socials.map((item, index) => {
                    const IconTag = item.icon;
                    return (
                        <Card
                            key={index}
                            className="relative overflow-hidden p-4 md:p-6 min-w-[200px] min-h-[150px] shadow-md border-0 rounded-none rounded-tl-xl rounded-br-xl bg-primary/40 justify-center items-center"
                        >
                            <div className="z-10 flex flex-col justify-end h-full">
                                <div className="flex flex-row gap-5 items-center">
                                    <IconTag className="w-15 h-15 text-primary" />
                                    <span className="text-4xl font-black text-primary">
                                        {item.number}
                                    </span>
                                </div>
                                <p className="font-medium text-primary mt-1 sm:text-xl">
                                    {item.text}
                                </p>
                            </div>
                        </Card>
                    )
                }
                )}
            </div>
        </section>
    );
}