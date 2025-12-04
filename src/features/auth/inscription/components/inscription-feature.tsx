import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyInvitationToken } from "../../actions"; 
import RegistrationForm from "./RegistrationForm";

interface InscriptionFeatureProps {
  token: string | undefined; 
}

export async function InscriptionFeature({ token }: InscriptionFeatureProps) {
  
  const invitation = token ? await verifyInvitationToken(token) : null;

  if (!invitation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Lien invalide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              Désolé, cette invitation a expiré, n'existe pas, ou a déjà été utilisée. 
              Veuillez demander une nouvelle invitation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Finaliser votre inscription
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            Bienvenue aux Foulées Avrillaises !
          </p>
        </CardHeader>
        <CardContent>
          <RegistrationForm email={invitation.email} token={invitation.token} />
        </CardContent>
      </Card>
    </div>
  );
}