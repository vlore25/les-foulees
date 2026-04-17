
import LegalDocsCardMobile from "../shared/LegalDocsCardMobile";
import { getLegalDocs } from "../../dal";

export default async function LegalDocsList() {
  // 1. Récupération des données côté serveur
  const docs = await getLegalDocs();

  return (
    <div className="py-4">
        <LegalDocsCardMobile isAdminPage={true} />
    </div>
  );
}