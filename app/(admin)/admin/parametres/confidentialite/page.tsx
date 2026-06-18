import { getSiteConfig } from "@/src/features/site-config/dal";
import { TextEditorPageClient } from "@/src/features/site-config/admin/TextEditorPageClient";

export const metadata = {
    title: "Modifier Politique de Confidentialité | Admin",
};

const defaultPrivacyContent = `
<h2>1. Introduction</h2>
<p>L'association Les Foulées Avrillaises accorde une grande importance à la protection de vos données personnelles. Cette politique détaille comment nous collectons et traitons vos données sur notre Site.</p>
<h2>2. Données collectées</h2>
<p>Dans le cadre de l'utilisation du Site, nous collectons les données suivantes :</p>
<ul>
    <li><strong>Identité :</strong> Nom, prénom, genre, date de naissance.</li>
    <li><strong>Contact :</strong> Adresse email, numéro de téléphone, adresse postale.</li>
    <li><strong>Urgence :</strong> Nom et téléphone de la personne à prévenir en cas d'accident.</li>
    <li><strong>Technique :</strong> Cookies de session (essentiels) et cookies de mesure d'audience (avec votre consentement).</li>
</ul>
<h2>3. Utilisation des Cookies</h2>
<p>Nous utilisons deux types de cookies :</p>
<p><strong>A. Cookies essentiels (Session)</strong><br>Ces cookies sont indispensables pour rester connecté à votre espace membre. Ils ne peuvent pas être désactivés car le site ne fonctionnerait plus.</p>
<p><strong>B. Cookies de mesure d'audience (Trafic)</strong><br>Nous utilisons Google Tag Manager pour comprendre comment les visiteurs utilisent le site. Ces cookies ne sont activés que si vous cliquez sur "Tout accepter" dans le bandeau de cookies.</p>
<h2>4. Finalités du traitement</h2>
<ul>
    <li>Gestion de votre adhésion et accès à l'espace membre.</li>
    <li>Envoi de communications liées à l'association.</li>
    <li>Amélioration du site via l'analyse du trafic.</li>
</ul>
<h2>5. Vos droits (RGPD)</h2>
<p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : <strong>contact@lesfouleesavrillaises.fr</strong>.</p>
`;

export default async function EditPrivacyPage() {
    const config = await getSiteConfig();
    const content = config?.privacyPolicy || defaultPrivacyContent;

    return (
        <TextEditorPageClient 
            initialContent={content}
            field="privacyPolicy"
            title="Modifier la Politique de Confidentialité"
            description="Modifiez et formatez le texte qui apparaîtra sur la page publique de confidentialité."
        />
    );
}
