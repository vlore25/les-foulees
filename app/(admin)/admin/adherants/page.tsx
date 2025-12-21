// app/admin/adherants/page.tsx
import MembershipsList from "@/src/features/membership/components/admin/MembershipsList";

// Dans Next.js 15, searchParams est une Promise
export default async function adherantsPage({
  searchParams,
}: {
  searchParams: Promise<{ seasonId?: string }>;
}) {
  return (
    <div className="p-6">
      <MembershipsList searchParams={searchParams} />
    </div>
  );
}