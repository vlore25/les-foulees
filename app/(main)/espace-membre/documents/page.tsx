import PageContentMembers from "@/components/common/PageContentMembers";
import LegalDocsCardMobile from "@/src/features/docs/components/shared/LegalDocsCardMobile";

export default function documentPagePage() {

    return (
        <PageContentMembers
            title="Documents administratifs"
            pageContent={
            <LegalDocsCardMobile 
                isAdminPage={false}/>}
        />
    );

}