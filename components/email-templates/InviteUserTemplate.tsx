import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface EmailTemplateProps {
  InvitationLink: string;
}

export function InviteUser({ InvitationLink }: EmailTemplateProps) {
  const disclaimer = "Si vous n'êtes pas à l'origine de cette demande ou si vous pensez qu'il s'agit d'une erreur, veuillez ignorer cet email en toute sécurité.";
  
  return (
    <EmailLayout footerDisclaimer={disclaimer}>
      <h2 style={{ color: '#1a1a1a', textAlign: 'center' }}>Vous êtes invité(e) !</h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Bonjour,</p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Nous sommes ravis de vous inviter à rejoindre la plateforme des <strong>Foulées Avrillaises</strong> ! 
        Créez votre compte dès maintenant pour accéder à votre espace membre.
      </p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href={InvitationLink} 
          style={{ 
            backgroundColor: '#7c4c9b', 
            color: '#ffffff', 
            padding: '14px 28px', 
            textDecoration: 'none', 
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'inline-block',
            fontSize: '16px'
          }}
        >
          Créer mon compte
        </a>
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br/>
        <a href={InvitationLink} style={{ color: '#0066cc', wordBreak: 'break-all' }}>{InvitationLink}</a>
      </p>
    </EmailLayout>
  );
}