import * as React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lesfouleesavrillaises.fr';
const logoUrl = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/logo/foulees-logo.png`;

interface EmailLayoutProps {
  children: React.ReactNode;
  footerDisclaimer?: React.ReactNode;
}

export function EmailLayout({ children, footerDisclaimer }: EmailLayoutProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333', padding: '20px', maxWidth: '600px', margin: '0 auto', border: '1px solid #eee', borderRadius: '8px' }}>
      {/* Header Logo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={logoUrl} alt="Les Foulées Avrillaises" style={{ maxWidth: '150px' }} />
      </div>

      {/* Main Content */}
      <div style={{ minHeight: '150px' }}>
        {children}
      </div>

      {/* Footer */}
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

      {/* Optional Disclaimer (e.g., "Ignore this email if...") */}
      {footerDisclaimer && (
        <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '20px' }}>
          {footerDisclaimer}
        </p>
      )}
    </div>
  );
}
