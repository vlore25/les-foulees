import { AdminUserDetails } from "@/src/lib/dto";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";
import { UserStatusControl } from "./UserStatusCOntrol";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formatGender = (gender: string | null | undefined) => {
    if (!gender) return "Non renseigné";
    switch (gender) {
        case "MALE": return "Homme";
        case "FEMALE": return "Femme";
        default: return gender;
    }
};

const formatRole = (role: string | null | undefined) => {
    if (!role) return "Non renseigné";
    switch (role) {
        case "USER": return "Utilisateur";
        case "ADMIN": return "Administrateur";
        default: return role;
    }
};

interface UserInfoProps {
    user: AdminUserDetails;
}

export default function UserInfo({ user }: UserInfoProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            
            <article className="flex items-center gap-6 mb-4">
                <Avatar className="w-24 h-24 border-2 border-primary/10">
                    <AvatarImage src={user.profileImageUrl || ""} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                        {user.name[0]}{user.lastname[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold capitalize">{user.name} {user.lastname}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </article>

            <article >
                <h3 className="font-bold text-lg mb-4">Informations Personnelles</h3>
                <div className="flex flex-col space-y-1">
                    <InfoRow label="Prénom" value={user.name} />
                    <InfoRow label="Nom" value={user.lastname} />
                    <InfoRow label="Genre" value={formatGender(user.genre)} />
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
                    <InfoRow label="Rôle" value={formatRole(user.role)} />
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