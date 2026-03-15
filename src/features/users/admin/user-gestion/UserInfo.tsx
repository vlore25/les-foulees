import { AdminUserDetails } from "@/src/lib/dto";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { UserStatusControl } from "./UserStatusCOntrol";

interface UserInfoProps {
    user: AdminUserDetails;
}

export default function UserInfo({ user }: UserInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            

            <article >
                <h3 className="font-bold text-lg mb-4">Informations Personnelles</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow label="Prénom" value={user.name} />
                    <InfoRow label="Nom" value={user.lastname} />
                    <InfoRow
                        label="Date de naissance"
                        value={user.birthdate ? new Date(user.birthdate).toLocaleDateString("fr-FR") : "Non renseignée"}
                    />
                </div>
            </article>

            <article >
                <h3 className="font-bold text-lg mb-4">Contact et Adresse</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow label="Email" value={user.email || "Non renseigné"} />
                    <InfoRow label="Téléphone" value={user.phone || "Non renseigné"} />
                    <InfoRow label="Adresse" value={user.address || "Non renseignée"} />
                    <InfoRow label="Code Postal" value={user.zipCode || "Non renseigné"} />
                    <InfoRow label="Ville" value={user.city || "Non renseignée"} />
                </div>
            </article>

            <article >
                <h3 className="font-bold text-lg mb-4">Compte & Permissions</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow
                        label="Statut"
                        value={
                            <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                                {user.status}
                            </Badge>
                        }
                    />
                    <InfoRow label="Rôle" value={user.role} />
                    <InfoRow
                        label="Enregistré le"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "Inconnue"}
                    />
                </div>
            </article>

            <article >
                <h3 className="font-bold text-lg mb-4">Contact d'Urgence</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow label="Prénom" value={user.emergencyName || "Non renseigné"} />
                    <InfoRow label="Nom" value={user.emergencyLastName || "Non renseigné"} />
                    <InfoRow label="Téléphone" value={user.emergencyPhone || "Non renseigné"} />
                </div>
            </article>

            <article>
                <h3 className="font-bold text-lg mb-4">Préférences Annuaire</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow label="Afficher l'email" value={user.showEmailDirectory ? "Oui" : "Non"} />
                    <InfoRow label="Afficher le téléphone" value={user.showPhoneDirectory ? "Oui" : "Non"} />
                </div>
            </article>
            <UserStatusControl
                userId={user.id}
                isActive={user.status} // Assurez-vous d'avoir ce champ dans votre schéma Prisma
            />
        </div>
    );
}

interface InfoRowProps {
    label: string;
    value: ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="grid grid-cols-4 items-center py-1.5">
            <span className="text-muted-foreground font-semibold col-span-2 sm:col-span-1 text-sm">{label}</span>
            <span className="font-semibold col-span-2 sm:col-span-1  text-sm">{value}</span>
        </div>
    );
}