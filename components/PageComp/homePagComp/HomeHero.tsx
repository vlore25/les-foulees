import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeHero() {
    return (
        <section className="relative flex flex-col w-full bg-background">
            <div className="relative h-[70vh] md:h-[92vh]">
                <Image
                    src="/images/home-hero-mobile.jpg"
                    alt="Notre club en pleine course"
                    fill
                    priority
                    className="object-cover object-center sm:hidden"
                    sizes="100vw"
                />
                <Image
                    src="/images/home-hero-desktop.jpg"
                    alt="Notre club en pleine course"
                    fill
                    priority
                    className="object-cover object-center hidden sm:block" 
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex flex-col justify-end sm:flex-row md:justify-between sm:items-end px-4 z-10 space-y-1 mb-20 lg:mx-40">
                    <article >
                        <h1 className="sm:text-2xl text-white-text lg:text-8xl">
                            Les Foulées <br />Avrillaises
                        </h1>
                        <p className="text-xl lg:text-3xl text-white-text leading-relaxed max-w-md">
                            Le plaisir de courir ensemble.
                        </p>
                    </article>
                    <article className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button asChild size="responsive">
                            <Link href="/inscription">Devenir membre</Link>
                        </Button>
                    </article>
                </div>
            </div>
        </section>
    );
}