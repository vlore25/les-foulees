import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/title";

export default function MentionsLegalesPage() {
    return (
        <Container className="py-4 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-4">
                    <Title title="Mentions Légales" />
                    <p className="text-muted-foreground font-medium italic">En vigueur au 10 avril 2026</p>
                </div>

                <section className="space-y-6 bg-white p-8 rounded-tl-[2rem] rounded-br-[2rem] shadow-sm border border-primary/5">
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            1. Édition du site
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le présent site, accessible à l’URL <strong>www.lesfouleesavrillaises.fr</strong>, est édité par :
                            <br /><br />
                            <strong>L'association Les Foulées Avrillaises</strong>, enregistrée sous le numéro W491000000, ayant son siège social situé à :
                            <br />
                            Mairie d'Avrillé, 1 Esplanade de l'Hôtel de Ville, 49240 Avrillé.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            2. Hébergement
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le Site est hébergé par la société <strong>IONOS SE</strong>, situé au :
                            <br />
                            7 place de la Gare, BP 70109, 57200 Sarreguemines Cedex, France.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            3. Directeur de publication
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Le Directeur de la publication du Site est le Président de l'association Les Foulées Avrillaises.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            4. Nous contacter
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Par téléphone : +33 (0)0 00 00 00 00<br />
                            Par email : contact@lesfouleesavrillaises.fr<br />
                            Par courrier : Mairie d'Avrillé, 1 Esplanade de l'Hôtel de Ville, 49240 Avrillé.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            5. Propriété intellectuelle
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                    </div>
                </section>
            </div>
        </Container>
    );
}
