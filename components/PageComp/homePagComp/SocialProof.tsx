import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import LoginButton from "@/src/features/auth/components/buttons/LoginButton";
import { getEventsCountCurrentYear } from "@/src/features/events/dal";
import { getUsersCount } from "@/src/features/users/dal";
import Image from "next/image";

export default async function SocialProof() {
    const eventsOfYears = await getEventsCountCurrentYear();
    const userCount = await getUsersCount();
    const clubYears = (new Date().getFullYear() - 2018);

    const socials = [
        {
            number: eventsOfYears,
            text: `Événements en ${new Date().getFullYear()}`,
            img: "/images/socials-proof/event.jpg"
        },
        {
            number: userCount,
            text: "Membres Actifs",
            img: "/images/socials-proof/members.jpg"
        },
        {
            number: clubYears,
            text: "Années d'existence",
            img: "/images/socials-proof/years.jpg"
        }
    ];

    return (
        <section className="my-10 max-w-6xl mx-auto px-4">
            <Title >
                Notre association en quelques chiffres :
            </Title>
            <div className="flex flex-col lg:flex-row justify-between my-2 gap-6">
                {socials.map((item, index) => (
                    <Card
                        key={index}
                        className="relative overflow-hidden text-left p-2 min-w-[300px] min-h-[150px] shadow-sm group"
                    >
                        <Image
                            src={item.img}
                            alt={item.text}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                        <div className="z-10 flex flex-col justify-end h-full">
                            <span className="text-4xl font-black text-white">
                                {item.number}
                            </span>
                            <p className="text-xs uppercase font-semibold text-white/90 mt-1">
                                {item.text}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}