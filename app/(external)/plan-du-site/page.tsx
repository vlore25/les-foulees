import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/title";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SITEMAP = [
    {
        title: "Visiteurs",
        links: [
            { name: "Accueil", href: "/" },
            { name: "À propos de nous", href: "/about" },
            { name: "Événements", href: "/evenements" },
            { name: "Nous contacter", href: "/contact" },
            { name: "Se connecter", href: "/login" },
        ]
    },
    {
        title: "Espace Membre",
        links: [
            { name: "Tableau de bord", href: "/espace-membre" },
            { name: "Annuaire des membres", href: "/espace-membre/annuaire" },
            { name: "Mon adhésion", href: "/espace-membre/adhesion" },
            { name: "Calendrier événements", href: "/espace-membre/evenements" },
            { name: "Mon compte", href: "/espace-membre/compte" },
        ]
    },
    {
        title: "Informations Légales",
        links: [
            { name: "Mentions Légales", href: "/about/mentions-legales" },
            { name: "Politique de Confidentialité", href: "/about/politique-de-confidentialite" },
            { name: "Plan du Site", href: "/about/plan-du-site" },
        ]
    }
];

export default function PlanDuSitePage() {
    return (
        <Container className="py-4 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-4">
                    <Title title="Plan du Site" />
                    <p className="text-muted-foreground font-medium italic">Retrouvez l'ensemble des pages du site des Foulées Avrillaises.</p>
                </div>

                <section className="space-y-8 bg-white p-8 rounded-tl-[2rem] rounded-br-[2rem] shadow-sm border border-primary/5">
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {SITEMAP.map((section) => (
                            <div key={section.title} className="space-y-4">
                                <h2 className="text-lg font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                                    {section.title}
                                </h2>
                                <ul className="flex flex-col gap-3">
                                    {section.links.map((link) => (
                                        <li key={link.href}>
                                            <Link 
                                                href={link.href} 
                                                className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5 text-primary opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Container>
    );
}
