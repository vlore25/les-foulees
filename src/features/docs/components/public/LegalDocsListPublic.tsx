import { getLegalDocs } from "../../dal";
import LegalDocsCardMobile from "../shared/LegalDocsCardMobile";



export default async function LegalDocsListPublic() {
    return (
        <div>
            <LegalDocsCardMobile isAdminPage={false} />
        </div>
    );
}