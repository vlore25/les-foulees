import UsersList from "@/src/features/users/components/UsersList";

export default function annuaire() {
    return (
        <section className="flex flex-col space-y-3">
                <h3>Annuaire des membres</h3>
                <UsersList />
        </section>
    );
}