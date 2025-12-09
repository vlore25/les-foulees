// lib/validations.ts
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// Base reusable schemas
export const emailSchema = z
  .string()
  .email({ message: 'Email invalide.' })
  .trim()

// Login schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});



export const registerFormSchema = z.object({
  // --- CHAMPS OBLIGATOIRES ---
  //Non email, the email liked to the user is where is received his invitation, he can change in profile configuration
  name: z
    .string()
    .min(2, { message: "Le prénom doit comporter au moins 2 caractères." })
    .trim(),

  lastname: z
    .string()
    .min(2, { message: "Le nom doit comporter au moins 2 caractères." })
    .trim(),

  phone: z
    .string()
    .min(1, { message: "Le téléphone est requis." })
    .regex(phoneRegex, { message: "Numéro de téléphone invalide." })
    .trim(),

  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .regex(/[a-zA-Z]/, { message: "Il doit contenir au moins une lettre." })
    .regex(/[0-9]/, { message: "Il doit contenir au moins un chiffre." })
    .regex(/[^a-zA-Z0-9]/, { message: "Il doit contenir au moins un caractère spécial." })
    .trim(),

  confirmPassword: z
    .string()
    .min(1, { message: "La confirmation du mot de passe est requise." }),

  adress: z
    .string()
    .min(5, { message: "L'adresse est requise." })
    .regex(/\d+.*[a-zA-Z]+/, { message: "L'adresse doit contenir un numéro et un nom de rue." })
    .trim(),

  birthdate: z.coerce.date()
    .refine((date) => !isNaN(date.getTime()), { 
      message: "La date de naissance est requise." 
    }),
  // --- CHAMPS OPTIONNELS ---

  zipCode: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{5}$/.test(val), { 
      message: "Le code postal doit comporter 5 chiffres." 
    })
    .transform(v => v || ""),

  city: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform(v => v || ""),

  emergencyName: z.string().optional().or(z.literal('')).transform(v => v || null),
  emergencyLastName: z.string().optional().or(z.literal('')).transform(v => v || null),
  emergencyPhone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Numéro d'urgence invalide."
    })
    .transform(v => v || null),
})

.refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});




export const inviteSchema = z.object({
  email: emailSchema,
});

export const EventTypeEnum = z.enum([
  "TRAIL",
  "COURSE_ROUTE",
  "ENTRAINEMENT",
  "VIE_DU_CLUB",
  "SORTIE",
  "AUTRE"
]);

export const eventSchema = z.object({
  title: z
    .string().toLowerCase()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." })
    .max(100, { message: "Le titre est trop long." })
    .trim(),

  dateStart: z.coerce
    .date()
    .refine((date) => date > new Date(), {
      message: "La date doit être dans le futur.",
    }),

  place: z
    .string()
    .min(2, { message: "Le lieu est requis." })
    .trim(),

  eventtype: EventTypeEnum,

  description: z
    .string()
    .min(10, { message: "La description doit faire au moins 10 caractères." })
    .max(3000, { message: "Description trop longue." })
    .optional()
    .or(z.literal("")),

  picture: z
    .instanceof(File, { message: "L'image est requise" })
    .refine((file) => file.size > 0, "Le fichier ne peut pas être vide")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Taille max 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Seuls .jpg, .png, .webp sont acceptés."
    ),
});


export const eventUpdateSchema = eventSchema.extend({
  picture: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Taille max 4MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Seuls .jpg, .png, .webp sont acceptés."
    ),
});


export const legalDocSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Le titre est requis (min 2 caractères)." })
    .max(100),

  description: z.string().optional(),

  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Le fichier est trop volumineux (Max 10Mo).`
    )
    .refine(
      // On vérifie si le type est dans notre nouvelle liste (Images + PDF)
      (file) => !file || ACCEPTED_DOC_TYPES.includes(file.type),
      "Formats acceptés : PDF, JPG, PNG, WEBP."
    ),
});
export type LegalDocFormState = {
  error?: {
    title?: string[];
    description?: string[];
    file?: string[];
  };
  message?: string | null;
} | undefined;

export type EventFormState = z.infer<typeof eventSchema>;

// Type exports for form states
export type LoginFormState = {
  errors?: {
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined

export type RegisterFormState = {
  errors?: {
    name?: string[]
    lastname?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined

export type InviteUserState = {
  errors?: {
    email?: string[];
  };
  message: string | null;
  success: boolean;
};