import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/title";


export default function PolitiqueConfidentialitePage() {
    return (
        <Container className="py-4 sm:py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-4">
                    <Title title="Politique de Confidentialité" />
                    <p className="text-muted-foreground font-medium italic">En vigueur au 10 avril 2026</p>
                </div>

                <section className="space-y-8 bg-white p-8 rounded-tl-[2rem] rounded-br-[2rem] shadow-sm border border-primary/5">
                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            1. Introduction
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            L'association Les Foulées Avrillaises accorde une grande importance à la protection de vos données personnelles. Cette politique détaille comment nous collectons et traitons vos données sur notre Site.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            2. Données collectées
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Dans le cadre de l'utilisation du Site, nous collectons les données suivantes :
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                            <li><strong>Identité :</strong> Nom, prénom, genre, date de naissance.</li>
                            <li><strong>Contact :</strong> Adresse email, numéro de téléphone, adresse postale.</li>
                            <li><strong>Urgence :</strong> Nom et téléphone de la personne à prévenir en cas d'accident.</li>
                            <li><strong>Technique :</strong> Cookies de session (essentiels) et cookies de mesure d'audience (avec votre consentement).</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            3. Utilisation des Cookies
                        </h2>
                        <div className="space-y-3 text-muted-foreground leading-relaxed">
                            <p>Nous utilisons deux types de cookies :</p>
                            <div className="pl-4 space-y-4 border-l-4 border-primary/10 py-1">
                                <div>
                                    <p className="font-bold text-primary">A. Cookies essentiels (Session)</p>
                                    <p>Ces cookies sont indispensables pour rester connecté à votre espace membre. Ils ne peuvent pas être désactivés car le site ne fonctionnerait plus.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-primary">B. Cookies de mesure d'audience (Trafic)</p>
                                    <p>Nous utilisons Google Tag Manager pour comprendre comment les visiteurs utilisent le site. Ces cookies ne sont activés que si vous cliquez sur "Tout accepter" dans le bandeau de cookies.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            4. Finalités du traitement
                        </h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4">
                            <li>Gestion de votre adhésion et accès à l'espace membre.</li>
                            <li>Envoi de communications liées à l'association.</li>
                            <li>Amélioration du site via l'analyse du trafic.</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-black uppercase tracking-tight text-primary italic border-b-2 border-primary/10 pb-2">
                            5. Vos droits (RGPD)
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : <strong>contact@lesfouleesavrillaises.fr</strong>.
                        </p>
                    </div>
                </section>
            </div>
        </Container>
    );
}
