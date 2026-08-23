// components/email-templates/RecoverPasswordTemplate.tsx
import * as React from 'react';

interface RecoverTemplateProps {
  recoverLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lesfouleesavrillaises.fr';
const logoUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/logo/foulees-logo.png`;

export function RecoverPasswordTemplate({ recoverLink }: RecoverTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={logoUrl} alt="Les Foulées Avrillaises" style={{ maxWidth: '150px' }} />
      </div>

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

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

      <div style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
        <p style={{ margin: '5px 0' }}><strong>Les Foulées Avrillaises</strong></p>
        <p style={{ margin: '5px 0' }}>
          Stade Auguste Delaune<br/>
          Rond Point du Général de Gaulle<br/>
          49240 Avrillé
        </p>
        <p style={{ margin: '5px 0' }}>
          Email : <a href="mailto:contact@lesfouleesavrillaises.fr" style={{ color: '#0066cc' }}>contact@lesfouleesavrillaises.fr</a>
        </p>
      </div>

      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '20px' }}>
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. 
        Votre mot de passe actuel restera inchangé.
      </p>
    </div>
  );
}