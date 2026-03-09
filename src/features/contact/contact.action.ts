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

  // Simulation d'envoi d'email (TODO: Connecter un service d'email ici)
  // const { name, email, phone, subject, message } = validatedFields.data;
  // await sendEmail(...) 
  
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log("Message reçu :", validatedFields.data);

  return {
    success: true,
    message: "Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais."
  };
}