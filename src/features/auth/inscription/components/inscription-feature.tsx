import { Card } from "@/components/ui/card";
import { verifyInvitationToken } from "../../actions";
import RegistrationForm from "./RegistrationForm";
import { UserPlus } from "lucide-react";
import ErrorCard from "@/components/common/feedback/ErrorCard";

interface InscriptionFeatureProps {
  token: string | undefined;
}

export async function InscriptionFeature({ token }: InscriptionFeatureProps) {

  const invitation = token ? await verifyInvitationToken(token) : null;

  if (!invitation) {
    return (
      <ErrorCard
        title="Lien invalide"
        message="Désolé, cette invitation a expiré, n'existe pas, ou a déjà été utilisée."
        link="/"
        linkMessage="Veuillez demander une nouvelle invitation."
      />
    );
  }

  return (
    <Card className="grid min-h-svh lg:grid-cols-2 p-0">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <h3>Activation de votre espace adhérent</h3>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <RegistrationForm email={invitation.email} token={invitation.token} />
        </div>
      </div>
      <div className="relative hidden lg:flex flex-col justify-end p-8 h-full min-h-[600px] rounded-e-xl overflow-hidden">
        <img
          src="/images/registration-hero.jpg"
          alt="Membres"
          className="absolute inset-0 h-full w-full object-cover border-e-xl"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 w-full max-w-md ml-auto">


          <div className="absolute -top-2 -right-2 z-20">
            <div className="bg-primary text-white h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform cursor-pointer">

              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <div
            className="bg-white/95 backdrop-blur-md p-8 rounded-[30px] shadow-2xl text-gray-900"
            style={{
              maskImage: 'radial-gradient(circle at top right, transparent 3.5rem, black 3.6rem)'
            }}
          >
            <h2 className="text-2xl font-bold mb-3 pr-10 leading-tight">
              Heureux de vous voir nous rejoindre !
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              En créant votre compte, vous pourrez désormais accéder aux fonctionnalités réservées aux membres de l'association Les Foulées Avrillaises
            </p>

          </div>
        </div>
      </div>
    </Card>


  );
}