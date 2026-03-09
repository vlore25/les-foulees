import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeHero() {
    return (
        <section className="relative flex flex-col w-full bg-background overflow-hidden">
            {/* Conteneur principal avec les bords arrondis signature au bas */}
            <div className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden rounded-br-[4rem] lg:rounded-br-[8rem] shadow-2xl">
                
                {/* Images avec gestion Mobile/Desktop */}
                <Image
                    src="/images/home-hero-mobile.jpg"
                    alt="Les Foulées Avrillaises en action"
                    fill
                    priority
                    className="object-cover object-center sm:hidden"
                    sizes="100vw"
                />
                <Image
                    src="/images/home-hero-desktop.jpg"
                    alt="Les Foulées Avrillaises en action"
                    fill
                    priority
                    className="object-cover object-center hidden sm:block" 
                    sizes="100vw"
                />

                {/* Overlay dégradé pour la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-transparent" />

                {/* Contenu textuel */}
                <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 lg:pb-24 lg:px-40">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        
                        <article className="space-y-4">
                            {/* Petit badge au-dessus du titre */}
                            <div className="inline-block bg-primary-500 text-white text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-tl-lg rounded-br-lg">
                                Association de course à pied
                            </div>
                            
                            <h1 className="text-5xl lg:text-9xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
                                Les Foulées <br />
                                <span className="text-primary-400">Avrillaises</span>
                            </h1>
                            
                            <p className="text-lg lg:text-3xl text-white/90 leading-relaxed max-w-xl font-medium border-l-4 border-primary-500 pl-4">
                                Le plaisir de courir ensemble
                            </p>
                        </article>

                        <article className="flex items-center">
                            <Button 
                                asChild 
                                size="lg" 
                                className="h-16 px-10 text-xl font-bold uppercase italic  hover:scale-105 transition-transform shadow-xl"
                            >
                                <Link href="/inscription">Devenir membre</Link>
                            </Button>
                        </article>

                    </div>
                </div>

                {/* Détail décoratif : ligne de vitesse en bas à droite */}
                <div className="absolute bottom-0 right-0 w-32 h-2 bg-primary-500 hidden lg:block" />
            </div>
        </section>
    );
}