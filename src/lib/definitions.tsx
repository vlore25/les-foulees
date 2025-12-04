// lib/validations.ts
import { z } from 'zod'

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

// Register schema
export const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  lastname: z 
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export const inviteSchema = z.object({
  email: emailSchema, 
});

 
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