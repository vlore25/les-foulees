'use server'

import { render } from '@react-email/render';
import { z } from 'zod';
import { ContactEmail } from '@/components/email-templates/ContactEmailTemplate';

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
      react: ContactEmail({
        contactInfo: {
          name,
          email,
          phone,
          subject,
          message
        }
      }),
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