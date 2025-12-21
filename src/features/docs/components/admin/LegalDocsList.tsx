
import LegalDocsTableDesktop from "./LegalDocsTableDesktop";
import { getLegalDocs } from "../../dal";

export default async function LegalDocsList() {
  // 1. Récupération des données côté serveur
  const docs = await getLegalDocs();

  return (
    <div>
        <LegalDocsTableDesktop docs={docs} />
    </div>
  );
}