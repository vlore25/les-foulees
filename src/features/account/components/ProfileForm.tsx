'use client'

import { Button } from '@/components/ui/button'
import { useActionState, useState, useEffect } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/src/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '../user.action'
import { Label } from '@radix-ui/react-dropdown-menu'

// On définit une interface pour les valeurs par défaut qui viennent de la BDD
interface ProfileFormProps {
    defaultValues: {
        name: string;
        lastname: string;
        email: string; // Read only
        phone?: string | null;
        birthdate?: Date | null;
        address?: string; // Attention orthographe schema prisma
        zipCode?: string;
        city?: string;
        imageUrl?: string | null;
        emergencyName?: string | null;
        emergencyLastName?: string | null;
        emergencyPhone?: string | null;
    }
}

export const ProfileForm = ({ defaultValues }: ProfileFormProps) => {
    const [state, action, pending] = useActionState(updateProfile, undefined);
    const [isDirty, setIsDirty] = useState(false);

    const handleFormChange = () => {  // <--- AJOUT
        if (!isDirty) setIsDirty(true);
    };

    return (
        <form action={action} onChange={handleFormChange} className="space-y-8 max-w-4xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                <div className="text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-bold">{defaultValues.name} {defaultValues.lastname}</h1>
                    <p className="text-muted-foreground">{defaultValues.email}</p>
                    {state?.message && (
                        <p className={cn("text-sm font-medium", state.success ? "text-green-600" : "text-red-500")}>
                            {state.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* 1. INFO PERSONNELLES */}
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle><p>Informations Personnelles</p></CardTitle>
                        <CardDescription>Vos informations d'identification pour le club.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Field>
                                    <FieldLabel>Prénom</FieldLabel>
                                    <Input id="name" name="name" defaultValue={defaultValues.name} />
                                </Field>
                                {state?.error?.name && <p className="text-red-500 text-xs mt-1">{state.error.name}</p>}
                            </div>
                            <div>
                                <Field>
                                    <FieldLabel>Nom</FieldLabel>
                                    <Input id="lastname" name="lastname" defaultValue={defaultValues.lastname} />
                                </Field>
                                {state?.error?.lastname && <p className="text-red-500 text-xs mt-1">{state.error.lastname}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <BirthDayPicker
                                name="birthdate"
                                defaultValue={defaultValues.birthdate}
                                onDateChange={() => setIsDirty(true)} />
                            <div>
                                <Field>
                                    <FieldLabel>Téléphone</FieldLabel>
                                    <Input id="phone" name="phone" defaultValue={defaultValues.phone || ''} placeholder="06..." />
                                </Field>
                                {state?.error?.phone && <p className="text-red-500 text-xs mt-1">{state.error.phone}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Adresse</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Field>
                            <FieldLabel>Rue & Numéro</FieldLabel>
                            <Input id="adress" name="adress" defaultValue={defaultValues.address || ''} />
                        </Field>
                        {state?.error?.adress && <p className="text-red-500 text-xs mt-1">{state.error.adress}</p>}

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <Field>
                                    <FieldLabel>CP</FieldLabel>
                                    <Input id="zipCode" name="zipCode" defaultValue={defaultValues.zipCode || ''} />
                                </Field>
                                {state?.error?.zipCode && <p className="text-red-500 text-xs mt-1">{state.error.zipCode}</p>}
                            </div>
                            <div className="col-span-2">
                                <Field>
                                    <FieldLabel>Ville</FieldLabel>
                                    <Input id="city" name="city" defaultValue={defaultValues.city || ''} />
                                </Field>
                                {state?.error?.city && <p className="text-red-500 text-xs mt-1">{state.error.city}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact d'urgence</CardTitle>
                        <CardDescription>Personne à contacter en cas de problème.</CardDescription>
                        {(!defaultValues.emergencyName || !defaultValues.emergencyLastName || !defaultValues.emergencyPhone) && (
                            <p className='text-red-500 text-xs mt-1'>
                                Pensez à renseigner un contact à prévenir !
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Prénom</FieldLabel>
                                <Input name="emergencyName" defaultValue={defaultValues.emergencyName || ''} />
                            </Field>
                            <Field>
                                <FieldLabel>Nom</FieldLabel>
                                <Input name="emergencyLastName" defaultValue={defaultValues.emergencyLastName || ''} />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel>Téléphone d'urgence</FieldLabel>
                            <Input name="emergencyPhone" defaultValue={defaultValues.emergencyPhone || ''} />
                        </Field>
                        {state?.error?.emergencyPhone && <p className="text-red-500 text-xs mt-1">{state.error.emergencyPhone}</p>}
                    </CardContent>
                </Card>

            </div>

            {/* ACTION BAR */}
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={pending || !isDirty} className="min-w-[150px]">
                    {pending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                        </>
                    ) : (
                        "Enregistrer les modifications"
                    )}
                </Button>
            </div>
        </form>
    );
};


// --- SOUS-COMPOSANT DATE PICKER (Adapté pour edit mode) ---
function BirthDayPicker({ 
    name, 
    defaultValue, 
    onDateChange // <--- 1. On l'ajoute ici dans la destructuration
}: { 
    name: string, 
    defaultValue?: Date | null, 
    onDateChange?: () => void // <--- 2. On l'ajoute ici dans le Type TypeScript
}) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)
  
    return (
      <div className="flex flex-col gap-1.5 flex-1 mt-1">
        <Label>
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
                if (onDateChange) onDateChange(); // <--- 3. On l'appelle ici quand la date change
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