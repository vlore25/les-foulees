

interface RecoverTemplateProps {
  recoverLink: string;
}

export function RecoverPasswordTemplate({ recoverLink }: RecoverTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', padding: '20px' }}>
      <h2>Réinitialisation de votre mot de passe</h2>
      
      <p>Bonjour,</p>
      
      <p>
        Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte 
        <strong> Les Foulées Avrillaises</strong>.
      </p>

      <p>Pour choisir un nouveau mot de passe, veuillez cliquer sur le lien ci-dessous :</p>

      <div style={{ margin: '24px 0' }}>
        <a 
          href={recoverLink} 
          style={{ 
            backgroundColor: '#000000', 
            color: '#ffffff', 
            padding: '12px 24px', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Changer mon mot de passe
        </a>
      </div>

      <p style={{ fontSize: '14px', color: '#666' }}>
        Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br/>
        <a href={recoverLink} style={{ color: '#666' }}>{recoverLink}</a>
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

      <p style={{ fontSize: '12px', color: '#888' }}>
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. 
        Votre mot de passe actuel restera inchangé.
      </p>
    </div>
  );
}