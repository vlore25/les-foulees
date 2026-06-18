import { getSiteConfig } from "@/src/features/site-config/dal";
import { TextEditorPageClient } from "@/src/features/site-config/admin/TextEditorPageClient";

export const metadata = {
    title: "Modifier Mentions Légales | Admin",
};

const defaultLegalContent = `
<h2>1. Édition du site</h2>
<p>Le présent site, accessible à l’URL <strong>www.lesfouleesavrillaises.fr</strong>, est édité par :<br><br><strong>L'association Les Foulées Avrillaises</strong>, enregistrée sous le numéro W491000000, ayant son siège social situé à :<br>Mairie d'Avrillé, 1 Esplanade de l'Hôtel de Ville, 49240 Avrillé.</p>
<h2>2. Hébergement</h2>
<p>Le Site est hébergé par la société <strong>IONOS SE</strong>, situé au :<br>7 place de la Gare, BP 70109, 57200 Sarreguemines Cedex, France.</p>
<h2>3. Directeur de publication</h2>
<p>Le Directeur de la publication du Site est le Président de l'association Les Foulées Avrillaises.</p>
<h2>4. Nous contacter</h2>
<p>Par téléphone : +33 (0)0 00 00 00 00<br>Par email : contact@lesfouleesavrillaises.fr<br>Par courrier : Mairie d'Avrillé, 1 Esplanade de l'Hôtel de Ville, 49240 Avrillé.</p>
<h2>5. Propriété intellectuelle</h2>
<p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
`;

export default async function EditLegalPage() {
    const config = await getSiteConfig();
    const content = config?.legalNotice || defaultLegalContent;

    return (
        <TextEditorPageClient 
            initialContent={content}
            field="legalNotice"
            title="Modifier les Mentions Légales"
            description="Renseignez ici les informations obligatoires de l'association (SIRET, Adresse, Hébergement web)."
        />
    );
}
