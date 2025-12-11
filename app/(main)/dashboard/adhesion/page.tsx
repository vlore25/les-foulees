import Membershipdetails from "@/src/features/membership/components/public/MemberShipDetails";

export default function membershipPage() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Adhesion</h3>
            </div>
            <Membershipdetails />
        </div>

    );
}