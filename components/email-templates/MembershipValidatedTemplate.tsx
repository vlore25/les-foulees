import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface MembershipValidatedProps {
  userName: string;
}

export function MembershipValidatedEmail({ userName }: MembershipValidatedProps) {
  return (
    <EmailLayout>
      <h2 style={{ color: '#1a1a1a', textAlign: 'center' }}>Adhésion validée !</h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Bonjour {userName},</p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Nous avons le plaisir de vous informer que votre dossier d'adhésion aux <strong>Foulées Avrillaises</strong> a été validé avec succès par notre équipe !
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Vous pouvez dès à présent profiter de toutes les activités de l'association. N'hésitez pas à vous connecter sur votre espace membre pour consulter les détails de votre adhésion.
      </p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href="https://www.lesfouleesavrillaises.fr/espace-membre/adhesion" 
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
          Accéder à mon espace
        </a>
      </div>
    </EmailLayout>
  );
}
