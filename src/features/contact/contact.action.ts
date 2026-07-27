'use server'

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("L'adresse email est invalide"),
  phone: z.string().optional(), 
  subject: z.string().min(5, "Le sujet est trop court"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactState = {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    subject?: string[];
    message?: string[];
  };
  message?: string;
} | null;

export async function sendContactEmail(prevState: ContactState, formData: FormData): Promise<ContactState> {
  // Extraction des données
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  // Validation
  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs dans le formulaire."
    };
  }

  // Envoi effectif des emails avec Resend
  const { name, email, phone, subject, message } = validatedFields.data;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || 'contact@lesfouleesavrillaises.fr';
    const senderEmail = 'contact@mail.lesfouleesavrillaises.fr';

    // 1. Envoyer le message à l'administration du club (auto-réception)
    await resend.emails.send({
      from: `Formulaire de Contact <${senderEmail}>`,
      to: [receiverEmail],
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 10px;">Nouveau message de contact</h2>
          <p>Vous avez reçu un nouveau message depuis le formulaire de contact du site :</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; width: 120px;">Nom :</td>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Email :</td>
              <td style="padding: 10px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold;">Téléphone :</td>
              <td style="padding: 10px;">${phone || 'Non renseigné'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Sujet :</td>
              <td style="padding: 10px;">${subject}</td>
            </tr>
          </table>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; white-space: pre-wrap; margin-top: 10px;">
            <strong>Message :</strong><br/><br/>${message}
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais."
    };

  } catch (error) {
    console.error("Erreur d'envoi d'email de contact:", error);
    return {
      success: false,
      message: "Une erreur technique est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard."
    };
  }
}