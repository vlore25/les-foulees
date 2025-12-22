// lib/validations.ts
import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = [...ACCEPTED_IMAGE_TYPES, "application/pdf"];
const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

//=============Base reusable schemas=====================
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z.email({ message: 'Email invalide.' })
  );

export const passwordSchema = z.string()
  .min(8, "Le mot de passe doit faire 8 caractères minimum")
  .regex(/[A-Z]/, "Au moins une majuscule")
  .regex(/[0-9]/, "Au moins un chiffre")
  .regex(/[^a-zA-Z0-9]/, "Au moins un caractère spécial (@, !, #, etc.)"
  );

//=============End base reusable schemas=====================

// Login schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(1, { message: "Mot de passe requis" }),
});


//New Password schema
export const newPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z
    .string()
    .min(1, { message: "La confirmation du mot de passe est requise." }),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });



export const registerFormSchema = z.object({

  //No email, the email liked to the user is where is received his invitation, he can change in profile configuration
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

  password: z.string()
    .min(8, "Le mot de passe doit faire 8 caractères minimum")
    .regex(/[A-Z]/, "Au moins une majuscule")
    .regex(/[0-9]/, "Au moins un chiffre")
    .regex(/[^a-zA-Z0-9]/, "Au moins un caractère spécial (@, !, #, etc.)"),

  confirmPassword: z
    .string()
    .min(1, { message: "La confirmation du mot de passe est requise." }),

  address: z
    .string()
    .min(5, { message: "L'adresse est requise." })
    .regex(/\d+.*[a-zA-Z]+/, { message: "L'adresse doit contenir un numéro et un nom de rue." })
    .trim(),

  birthdate: z.coerce.date()
    .refine((date) => !isNaN(date.getTime()), {
      message: "La date de naissance est requise."
    }),
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
  emergencyName: z.string().optional().or(z.literal('')),
  emergencyLastName: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')).refine(val => !val || phoneRegex.test(val), "Numéro invalide"),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions pour continuer.",
  }),

})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
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

const eventBase = z.object({
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

  dateEnd: z.coerce
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


export const eventSchema = eventBase.refine((data) => data.dateEnd > data.dateStart, {
  message: "La date de fin doit être postérieure à la date de début.",
  path: ["dateEnd"],
});



export const eventUpdateSchema = eventBase
  .extend({
    picture: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Taille max 4MB.`)
      .refine(
        (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Seuls .jpg, .png, .webp sont acceptés."
      ),
  })
  .refine((data) => data.dateEnd > data.dateStart, {
    message: "La date de fin doit être postérieure à la date de début.",
    path: ["dateEnd"],
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

export const profileFormSchema = z.object({
  name: z.string().min(2, "Prénom trop court").trim(),
  lastname: z.string().min(2, "Nom trop court").trim(),
  phone: z.string().regex(phoneRegex, "Numéro invalide").trim(),
  birthdate: z.string()
    .trim()
    .min(1, { message: "La date de naissance est requise." })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Format de date invalide."
    }),
  address: z.string().min(5, "Adresse requise").trim(),
  zipCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  city: z.string().min(1, "Ville requise").trim(),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
  emergencyName: z.string().optional().or(z.literal('')),
  emergencyLastName: z.string().optional().or(z.literal('')),
  emergencyPhone: z.string().optional().or(z.literal('')).refine(val => !val || phoneRegex.test(val), "Numéro invalide"),
});


export const MembershipTypeEnum = z.enum([
  "INDIVIDUAL",
  "YOUNG",
  "LICENSE_RUNNING"
]);

export const PaymentMethodEnum = z.enum([
  "CHECK",    // Chèque
  "TRANSFER", // Virement
  "CASH",     // Espèces
  "ONLINE"    // Si vous avez Stripe plus tard
]);

export const membershipSchema = z.object({
  type: MembershipTypeEnum,
  paymentMethod: PaymentMethodEnum,
  ffaLicenseNumber: z.string().optional(),
  previousClub: z.string().optional(),
  showPhoneDirectory: z.boolean().default(false),
  showEmailDirectory: z.boolean().default(false),
});

// Type TypeScript inféré
export type MembershipFormValues = z.infer<typeof membershipSchema>;

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