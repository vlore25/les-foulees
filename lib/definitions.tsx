// lib/validations.ts
import { z } from 'zod'

// Base reusable schemas
const emailSchema = z
  .string()
  .email({ message: 'Please enter a valid email.' })
  .trim()

const passwordSchema = z
  .string()
  .min(8, { message: 'Be at least 8 characters long' })
  .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
  .regex(/[0-9]/, { message: 'Contain at least one number.' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character.',
  })
  .trim()

const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long.' })
  .trim()

// Login schema (only email + password)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }) // Less strict for login
})

// Register schema (name + email + password + confirmation)
export const registerFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})
 
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

// Update profile schema
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional()
})

// Reset password schema (only email)
export const resetPasswordSchema = z.object({
  email: emailSchema
})

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })

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
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  message?: string
} | undefined

export type UpdateProfileFormState = {
  errors?: {
    name?: string[]
    email?: string[]
  }
  message?: string
} | undefined

export type ResetPasswordFormState = {
  errors?: {
    email?: string[]
  }
  message?: string
} | undefined

export type ChangePasswordFormState = {
  errors?: {
    currentPassword?: string[]
    newPassword?: string[]
    confirmPassword?: string[]
  }
  message?: string
} | undefined