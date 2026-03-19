import { z } from 'zod';

// ============= CONFIGURATION GLOBALE =====================
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Ajusté pour correspondre à vos messages d'erreur)
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10MB pour les documents légaux
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// ============= SCHÉMAS DE BASE RÉUTILISABLES =====================
export const emailSchema = z
  .string({ message: "L'email est requis." })
  .trim()
  .toLowerCase()
  .pipe(z.email({ message: 'Email invalide.' }));

export const passwordSchema = z.string({ message: "Le mot de passe est requis." })
  .min(8, "Le mot de passe doit faire 8 caractères minimum")
  .regex(/[A-Z]/, "Au moins une majuscule requise")
  .regex(/[0-9]/, "Au moins un chiffre requis")
  .regex(/[^a-zA-Z0-9]/, "Au moins un caractère spécial (@, !, #, etc.) requis");

// ============= SCHÉMAS D'AUTHENTIFICATION =====================
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});

export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Le prénom doit comporter au moins 2 caractères." }).trim(),
  lastname: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }).trim(),
  phone: z.string().regex(phoneRegex, { message: "Numéro de téléphone invalide." }).trim(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, { message: "La confirmation du mot de passe est requise." }),
  address: z.string().min(5, { message: "L'adresse est requise." }).regex(/\d+.*[a-zA-Z]+/, { message: "L'adresse doit contenir un numéro et un nom de rue." }).trim(),
  birthdate: z.coerce.date({ message: "La date de naissance est requise ou invalide." }),
  zipCode: z.string().optional().or(z.literal('')).refine((val) => !val || /^\d{5}$/.test(val), { message: "Le code postal doit comporter 5 chiffres." }).transform(v => v || ""),
  city: z.string().optional().or(z.literal('')).transform(v => v || ""),
  emergencyName: z.string().optional().or(z.literal('')),
  emergencyLastName: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')).refine(val => !val || phoneRegex.test(val), "Numéro d'urgence invalide"),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, { message: "Vous devez accepter les conditions pour continuer." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

export const inviteSchema = z.object({
  email: emailSchema,
});

// ============= SCHÉMAS DES ÉVÉNEMENTS =====================
export const EventTypeEnum = z.enum([
  "TRAIL", "COURSE_ROUTE", "ENTRAINEMENT", "VIE_DU_CLUB", "SORTIE", "AUTRE"
], { message: "Le type d'événement est requis et doit être valide." });

export const eventBase = z.object({
  title: z.string({ message: "Le titre de l'événement est requis." })
    .trim().toLowerCase()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." })
    .max(100, { message: "Le titre est trop long (100 caractères maximum)." }),
  dateStart: z.coerce.date({ message: "La date de début est requise et doit être valide." }),
  dateEnd: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return val;
  }, z.coerce.date({ message: "La date de fin est invalide." }).optional()),
  place: z.string({ message: "Le lieu de l'événement est requis." })
    .trim().min(2, { message: "Le lieu doit contenir au moins 2 caractères." }),
  eventtype: EventTypeEnum,
  description: z.string().max(3000, { message: "La description est trop longue." }).optional().or(z.literal("")),
  distances: z.preprocess((val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return [val];
  }, z.array(z.string())).optional(),
});

// CREATE : L'image est obligatoire, et on vérifie que dateEnd > dateStart
export const eventSchema = eventBase.extend({
  picture: z.instanceof(File, { message: "L'image de couverture est requise." })
    .refine((file) => file.size > 0, "L'image est requise et ne peut pas être vide.")
    .refine((file) => file.size <= MAX_FILE_SIZE, "La taille de l'image ne doit pas dépasser 4MB.")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), "Format invalide. Seuls .jpg, .png, et .webp sont acceptés."),
}).refine((data) => {
  // CORRECTION : On vérifie si dateEnd existe avant de comparer
  if (!data.dateEnd) return true;
  return data.dateEnd > data.dateStart;
}, {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["dateEnd"],
});

// UPDATE : L'image est optionnelle, et on vérifie que dateEnd > dateStart
export const eventUpdateSchema = eventBase.extend({
  picture: z.instanceof(File).optional()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Taille max 4MB.`)
    .refine((file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type), "Seuls .jpg, .png, .webp sont acceptés."),
}).refine((data) => {
  // CORRECTION : On vérifie si dateEnd existe avant de comparer
  if (!data.dateEnd) return true;
  return data.dateEnd > data.dateStart;
}, {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["dateEnd"],
});

// ============= SCHÉMAS DES DOCUMENTS LÉGAUX =====================
export const legalDocSchema = z.object({
  title: z.string().min(2, { message: "Le titre est requis (min 2 caractères)." }).max(100),
  description: z.string().optional(),
  file: z.instanceof(File).optional()
    .refine((file) => !file || file.size <= MAX_DOC_SIZE, `Le fichier est trop volumineux (Max 10Mo).`)
    .refine((file) => !file || ACCEPTED_DOC_TYPES.includes(file.type), "Formats acceptés : PDF, JPG, PNG, WEBP."),
});

// ============= SCHÉMAS PROFILS ET ADHÉSIONS =====================
export const profileFormSchema = z.object({
  name: z.string().min(2, "Prénom trop court").trim(),
  lastname: z.string().min(2, "Nom trop court").trim(),
  phone: z.string().regex(phoneRegex, "Numéro invalide").trim(),
  birthdate: z.string().trim().min(1, { message: "La date de naissance est requise." })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), { message: "Format de date invalide." }),
  address: z.string().min(5, "Adresse requise").trim(),
  zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  city: z.string().min(1, "Ville requise").trim(),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
  emergencyName: z.string().optional().or(z.literal('')),
  emergencyLastName: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')).refine(val => !val || phoneRegex.test(val), "Numéro invalide"),
});

export const MembershipTypeEnum = z.enum(["INDIVIDUAL", "YOUNG", "LICENSE_RUNNING"]);
export const PaymentMethodEnum = z.enum(["CHECK", "TRANSFER", "CASH", "ONLINE"]);

export const membershipSchema = z.object({
  type: MembershipTypeEnum,
  paymentMethod: PaymentMethodEnum,
  ffaLicenseNumber: z.string().optional(),
  previousClub: z.string().optional(),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
});

export type MembershipFormValues = z.infer<typeof membershipSchema>;

// ============= TYPES DE RETOUR POUR SERVER ACTIONS (FORM STATES) =====================

export type ProfileFormState = {
  error?: {
    name?: string[];
    lastname?: string[];
    phone?: string[];
    address?: string[];
    zipCode?: string[];
    city?: string[];
    birthdate?: string[];
    picture?: string[];
    emergencyPhone?: string[];
  };
  message?: string | null;
  success?: boolean;
} | undefined;

export type LegalDocFormState = {
  error?: {
    title?: string[];
    description?: string[];
    file?: string[];
  };
  message?: string | null;
} | undefined;

// CORRECTION : Retourne l'état des erreurs, et non les données Zod
export type EventFormState = {
  error?: {
    title?: string[];
    dateStart?: string[];
    dateEnd?: string[];
    place?: string[];
    eventtype?: string[];
    description?: string[];
    distances?: string[];
    picture?: string[];
  };
  message?: string | null;
} | undefined;

export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

export type RegisterFormState = {
  errors?: {
    name?: string[];
    lastname?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
} | undefined;

export type InviteUserState = {
  errors?: {
    email?: string[];
  };
  message: string | null;
  success: boolean;
};