import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface RecoverTemplateProps {
  recoverLink: string;
}

export function RecoverPasswordTemplate({ recoverLink }: RecoverTemplateProps) {
  const disclaimer = "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel restera inchangé.";

  return (
    <EmailLayout footerDisclaimer={disclaimer}>
      <h2 style={{ color: '#1a1a1a', textAlign: 'center' }}>Réinitialisation de mot de passe</h2>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Bonjour,</p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
        Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte 
        <strong> Les Foulées Avrillaises</strong>.
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5' }}>Pour choisir un nouveau mot de passe, veuillez cliquer sur le bouton ci-dessous :</p>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a 
          href={recoverLink} 
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
          Changer mon mot de passe
        </a>
      </div>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br/>
        <a href={recoverLink} style={{ color: '#0066cc', wordBreak: 'break-all' }}>{recoverLink}</a>
      </p>
    </EmailLayout>
  );
}