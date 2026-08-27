import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ContactInfoProps {
    contactInfo: {
        name: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
    }
}

export function ContactEmail({ contactInfo }: ContactInfoProps) {
    return (
        <EmailLayout>
            <h2 style={{ color: '#111', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Nouveau message de contact</h2>
            <p>Vous avez reçu un nouveau message depuis le formulaire de contact du site :</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0' }}>
                <tbody>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold', width: '120px' }}>Nom :</td>
                        <td style={{ padding: '10px' }}>{contactInfo.name}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>Email :</td>
                        <td style={{ padding: '10px' }}><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></td>
                    </tr>
                    <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>Téléphone :</td>
                        <td style={{ padding: '10px' }}>{contactInfo.phone || 'Non renseigné'}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>Sujet :</td>
                        <td style={{ padding: '10px' }}>{contactInfo.subject}</td>
                    </tr>
                </tbody>
            </table>
            <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '4px', whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                <strong>Message :</strong><br /><br />{contactInfo.message}
            </div>
        </EmailLayout>
    );
}