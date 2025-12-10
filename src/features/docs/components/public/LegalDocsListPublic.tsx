import { getLegalDocs } from "../../dal";
import LegalDocsCardMobile from "../shared/LegalDocsCardMobile";


export default async function LegalDocsListPublic() {
    const docs = await getLegalDocs();
    return (
        <div>
            <LegalDocsCardMobile docs={docs} />
        </div>
    );
}