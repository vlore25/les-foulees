// components/email-templates/InviteUser.tsx
import * as React from 'react';

interface EmailTemplateProps {
  InvitationLink: string;
}

export function InviteUser({ InvitationLink}: EmailTemplateProps) {
  return (
    <div>
      <p>Ceci est une invitation pour devenir membre des Foulées Avrillaises!</p>
      <p>Suivez le lien pour vous inscrire:</p>
      <a href={InvitationLink} style={{ color: 'blue', textDecoration: 'underline' }}>
        Cliquez ici pour vous inscrire
      </a>
      <p>Si vous n'êtes pas à l'origine de cette démarche, veuillez ignorer cet email.</p>
    </div>
  );
}