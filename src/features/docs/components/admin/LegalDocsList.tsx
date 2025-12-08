
import LegalDocsTableDesktop from "./LegalDocsTableDesktop";
import LegalDocsCardMobile from "./LegalDocsCardMobile";
import { getLegalDocs } from "../../dal";

export default async function LegalDocsList() {
  // 1. Récupération des données côté serveur
  const docs = await getLegalDocs();

  return (
    <div>
      <div className="hidden md:block">
        <LegalDocsTableDesktop docs={docs} />
      </div>
      <div className="md:hidden">
        <LegalDocsCardMobile docs={docs} />
      </div>
    </div>
  );
}