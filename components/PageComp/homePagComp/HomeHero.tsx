import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeHero() {
    return (
        <section className="relative flex flex-col w-100vh bg-background">
            <div className="relative h-[92vh]">
                <Image
                    src="/images/home-hero.jpg"
                    fill
                    priority
                    className="object-cover"
                    alt="Course des Foulées Avrillaises"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex flex-col justify-end sm:flex-row md:justify-between sm:items-end px-4 z-10 space-y-1 mb-20 lg:mx-40">
                    <article >
                        <h1 className="sm:text-2xl text-white lg:text-8xl">
                            Les Foulées <br />Avrillaises
                        </h1>
                        <p className="text-xl lg:text-3xl text-white leading-relaxed max-w-md">
                            Le plaisir de courir ensemble.
                        </p>
                    </article>
                    <article className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button asChild size="responsive">
                            <Link href="/inscription">Nous contacter</Link>
                        </Button>
                        <Button size="responsive" className="bg-white text-black hover:text-white">
                            <Link href="/evenements">Nos entraînements</Link>
                        </Button>
                    </article>
                </div>
            </div>
        </section>
    );
}