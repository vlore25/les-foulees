'use client'

import { registerUser } from '@/src/features/auth/actions'
import { Button } from '@/components/ui/button'
import { useActionState, useState } from 'react' // Import useState
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AlertCircle, CalendarIcon, Check, CheckCircle2, ChevronLeft, ChevronRight, Globe } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@radix-ui/react-dropdown-menu'
import { cn } from '@/src/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

const STEPS = [
  { id: 0, title: "Identité", fields: ["name", "lastname", "phone", "birthday"] },
  { id: 1, title: "Adresse", fields: ["address", "zip-code", "city"] },
  { id: 2, title: "Contact d'urgence", fields: ["emergencyName", "emergencyLastName", "emergencyPhone"] },
  { id: 3, title: "Sécurité", fields: ["password", "confirmPassword"] }
]

export default function RegistrationForm({ email, token }: { email: string, token: string }) {
  const [state, action, pending] = useActionState(registerUser, undefined)
  const [currentStep, setCurrentStep] = useState(0)

  if (state?.success) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">Inscription réussie !</h2>
        <p className="text-green-700">Votre compte a été créé avec succès.</p>
        <Button asChild className="bg-green-600 hover:bg-green-700 text-white mt-4">
          <Link href="/login">Accéder à la connexion</Link>
        </Button>
      </div>
    )
  }

  const handleNext = () => {
    const currentFields = STEPS[currentStep].fields
    let isValid = true

    currentFields.forEach(fieldName => {
      const input = document.querySelector(`[name="${fieldName}"]`) as HTMLInputElement
      if (input && !input.checkValidity()) {
        input.reportValidity()
        isValid = false
      }
    })

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="w-full max-w-lg mx-auto">

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 font-semibold text-sm",
                index < currentStep ? "bg-primary border-primary text-white" : // Passé
                  index === currentStep ? "border-primary text-primary bg-background" : // Actuel
                    "border-muted text-muted-foreground bg-background" // Futur
              )}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-xs mt-1 text-muted-foreground font-medium">{step.title}</span>
            </div>
          ))}
          <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-0 hidden md:block" />
        </div>
        <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {state?.message && !state.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{state.message}</p>
        </div>
      )}

      {/* --- FORMULAIRE --- */}
      <form action={action} className="flex flex-col gap-6 min-h-[400px]">
        <input type="hidden" name="token" value={token} />

        {/* IDENTITÉ */}
        <div className={cn("space-y-4", currentStep === 0 ? "block" : "hidden")}>
          <h2 className="text-xl font-semibold mb-4">Qui êtes-vous ?</h2>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className="flex-1">
              <Field>
                <FieldLabel>Prénom</FieldLabel>
                <Input id="name" name="name" placeholder="Votre prénom" required />
              </Field>
              <ErrorMessage errors={state?.errors?.name} />
            </div>
            <div className="flex-1">
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <Input id="lastname" name="lastname" placeholder="Nom" required />
              </Field>
              <ErrorMessage errors={state?.errors?.lastname} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full items-start">
            <div className="flex-1">
              <BirthDayPicker name="birthdate" />
              <ErrorMessage errors={state?.errors?.birthdate} />
            </div>
            <div className="flex-1">
              <Field>
                <FieldLabel>Téléphone</FieldLabel>
                <Input id="phone" name="phone" placeholder="06 12 34 56 78" required />
              </Field>
              <ErrorMessage errors={state?.errors?.phone} />
            </div>
          </div>
        </div>

        {/* ADRESSE */}
        <div className={cn("space-y-4", currentStep === 1 ? "block" : "hidden")}>
          <h2 className="text-xl font-semibold mb-4">Où habitez-vous ?</h2>
          <div>
            <Field>
              <FieldLabel>Adresse</FieldLabel>
              <Input id="address" name="address" placeholder="N° et rue" required />
            </Field>
            <ErrorMessage errors={state?.errors?.address} />
          </div>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className="w-full md:w-1/3">
              <Field>
                <FieldLabel>Code Postal</FieldLabel>
                <Input id="zip-code" name="zip-code" placeholder="75000" />
              </Field>
              <ErrorMessage errors={state?.errors?.zipCode} />
            </div>
            <div className="flex-1">
              <Field>
                <FieldLabel>Ville</FieldLabel>
                <Input id="city" name="city" placeholder="Ville" />
              </Field>
              <ErrorMessage errors={state?.errors?.city} />
            </div>
          </div>
        </div>

        {/*CONTACT D'URGENCE*/}
        <div className={cn("space-y-4", currentStep === 2 ? "block" : "hidden")}>
          <h2 className="text-xl font-semibold mb-4">Contact d'urgence</h2>
          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className="flex-1">
              <Field>
                <FieldLabel>Prénom</FieldLabel>
                <Input name="emergencyName" />
              </Field>
              <ErrorMessage errors={state?.errors?.emergencyName} />
            </div>
            <div className="flex-1">
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <Input name="emergencyLastName" />
              </Field>
              <ErrorMessage errors={state?.errors?.emergencyLastName} />
            </div>
          </div>
          <div>
            <Field>
              <FieldLabel>Téléphone d'urgence</FieldLabel>
              <Input name="emergencyPhone" />
            </Field>
            <ErrorMessage errors={state?.errors?.emergencyPhone} />
          </div>
        </div>

        {/* ÉTAPE 3 : SÉCURITÉ */}
        <div className={cn("space-y-4", currentStep === 3 ? "block" : "hidden")}>
          <h2 className="text-xl font-semibold mb-4">Sécuriser votre compte</h2>

          <Field>
            <FieldLabel>Courriel</FieldLabel>
            <Input id="email" name="email" value={email} readOnly className="bg-muted text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Lié à votre invitation.</p>
          </Field>

          <div className='flex flex-col md:flex-row gap-4 w-full'>
            <div className="flex-1">
              <Field>
                <FieldLabel>Mot de passe</FieldLabel>
                <Input id="password" name="password" type="password" required />
              </Field>
              <ErrorMessage errors={state?.errors?.password} />
            </div>
            <div className="flex-1">
              <Field>
                <FieldLabel>Confirmer</FieldLabel>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </Field>
              <ErrorMessage errors={state?.errors?.confirmPassword} />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Checkbox id="terms-conditions" required />
            <Label className="text-sm">J'accepte les Conditions Générales et la Politique de Confidentialité.</Label>
          </div>
        </div>
        
        {/* --- NAVIGATION --- */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={cn(currentStep === 0 && "invisible")} // Cache le bouton au début
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Retour
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Suivant <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={pending}>
              {pending ? 'Création...' : 'Finaliser l’inscription'}
            </Button>
          )}
        </div>

      </form >
    </div >
  )
}

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-sm mt-1 animate-in slide-in-from-top-1">
      {errors[0]}
    </p>
  );
}

function BirthDayPicker({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-2 flex-1">
      <Label className="text-sm font-medium">
        Date de naissance
      </Label>
      <input type="hidden" name={name} value={date ? date.toISOString() : ''} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            {date ? date.toLocaleDateString('fr-FR') : "Sélectionner une date"}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setOpen(false)
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            captionLayout="dropdown"
            fromYear={1920}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}