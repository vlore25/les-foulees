// components/email-templates/InviteUser.tsx
import * as React from 'react';

interface EmailTemplateProps {
  InvitationLink: string;
}


const logoUrl = "https://www.lesfouleesavrillaises.fr/_next/image?url=%2Flogo%2Ffoulees-logo.png&w=128&q=75";

export function InviteUser({ InvitationLink }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={logoUrl} alt="Les Foulées Avrillaises" style={{ maxWidth: '150px' }} />
      </div>

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
        Si vous n'êtes pas à l'origine de cette demande ou si vous pensez qu'il s'agit d'une erreur, 
        veuillez ignorer cet email en toute sécurité.
      </p>
    </div>
  );
}