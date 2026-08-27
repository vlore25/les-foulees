import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface MembershipRejectedProps {
  userName: string;
}

export function MembershipRejectedEmail({ userName }: MembershipRejectedProps) {
  return (
    <EmailLayout>
      <h2 style={{ color: '#1a1a1a', textAlign: 'center' }}>Dossier incomplet ou refusé</h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Bonjour {userName},</p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Nous vous informons qu'après examen, votre dossier d'adhésion aux <strong>Foulées Avrillaises</strong> n'a pas pu être validé en l'état.
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Il manque probablement un document (comme le certificat PPS) ou une information essentielle. 
        Nous vous invitons à vous connecter à votre espace membre pour vérifier l'état de votre dossier et fournir les éléments manquants.
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
          Voir mon dossier
        </a>
      </div>
    </EmailLayout>
  );
}
