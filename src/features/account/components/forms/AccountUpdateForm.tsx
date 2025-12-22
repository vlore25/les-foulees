'use client'

import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/src/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '../../user.action'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import SuccesCard from '@/components/common/feedback/SuccesCard'
import SuccesBox from '@/components/common/feedback/SuccesBox'


interface ProfileFormProps {
    defaultValues: {
        name: string;
        lastname: string;
        email: string;
        phone?: string | null;
        birthdate?: Date | null;
        address?: string; 
        zipCode?: string;
        city?: string;
        imageUrl?: string | null;
        emergencyName?: string | null;
        emergencyLastName?: string | null;
        emergencyPhone?: string | null;
        showPhoneDirectory?: boolean;
        showEmailDirectory?: boolean;
    }
}

// --- COMPOSANT PRINCIPAL ---
export const ProfileForm = ({ defaultValues }: ProfileFormProps) => {
    const [state, action, pending] = useActionState(updateProfile, undefined);
    const [isDirty, setIsDirty] = useState(false);
    console.log(defaultValues)

    const handleFormChange = () => {
        if (!isDirty) setIsDirty(true);
    };
  

    return (
        <form action={action} onChange={handleFormChange} className="space-y-8 max-w-4xl  pb-10" noValidate>

            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
                <div className="text-center md:text-left space-y-1">
                    <h1 className="text-3xl font-bold capitalize">{defaultValues.name} {defaultValues.lastname}</h1>
                    <p className="text-muted-foreground">{defaultValues.email}</p>
                    {state?.message && state.success &&
                        <SuccesBox message ={state?.message}/>
                    }
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. INFO PERSONNELLES */}
                <Card className='md:col-span-2 border-0 shadow-none'>
                    <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                        <CardDescription>Vos informations d'identification pour le club.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormInput
                                label="Prénom" name="name"
                                defaultValue={defaultValues.name} error={state?.error?.name}
                            />
                            <FormInput
                                label="Nom" name="lastname"
                                defaultValue={defaultValues.lastname} error={state?.error?.lastname}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <BirthDayPicker
                                name="birthdate"
                                defaultValue={defaultValues.birthdate}
                                onDateChange={() => setIsDirty(true)}
                            />
                            <FormInput
                                label="Téléphone" name="phone" placeholder="06..."
                                defaultValue={defaultValues.phone || ''} error={state?.error?.phone}
                            />
                        </div>
                        <div>
                            <p>Annuaire des adhérents</p>
                            <p className="text-xs text-muted-foreground">
                                Ces informations seront visibles uniquement par les membres connectés.
                            </p>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showPhoneDirectory"
                                    name="showPhoneDirectory"
                                    defaultChecked={defaultValues.showPhoneDirectory}
                                />
                                <Label htmlFor="showPhoneDirectory">Diffuser mon téléphone</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="showEmailDirectory"
                                    name="showEmailDirectory"
                                    defaultChecked={defaultValues.showEmailDirectory} 
                                />
                                <Label htmlFor="showEmailDirectory">Diffuser mon Courriel</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. ADRESSE */}
                <Card className='border-0 shadow-none'>
                    <CardHeader>
                        <CardTitle>Adresse</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormInput
                            label="Rue & Numéro" name="address"
                            defaultValue={defaultValues.address || ''} error={state?.error?.address}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <FormInput
                                    label="CP" name="zipCode"
                                    defaultValue={defaultValues.zipCode || ''} error={state?.error?.zipCode}
                                />
                            </div>
                            <div className="col-span-2">
                                <FormInput
                                    label="Ville" name="city"
                                    defaultValue={defaultValues.city || ''} error={state?.error?.city}
                                />
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* 3. CONTACT D'URGENCE */}
                <Card className='border-0 shadow-none'>
                    <CardHeader>
                        <CardTitle>Contact d'urgence</CardTitle>
                        <CardDescription>Personne à contacter en cas de problème.</CardDescription>
                        {(!defaultValues.emergencyName || !defaultValues.emergencyPhone) && (
                            <p className='text-orange-600 text-xs mt-1 font-medium'>
                                Pensez à renseigner un contact à prévenir !
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Prénom" name="emergencyName"
                                defaultValue={defaultValues.emergencyName || ''}
                            />
                            <FormInput
                                label="Nom" name="emergencyLastName"
                                defaultValue={defaultValues.emergencyLastName || ''}
                            />
                        </div>
                        <FormInput
                            label="Téléphone d'urgence" name="emergencyPhone"
                            defaultValue={defaultValues.emergencyPhone || ''} error={state?.error?.emergencyPhone}
                        />
                    </CardContent>
                </Card>

            </div>

            {/* ACTION BAR */}
            <div className="flex justify-end pt-4 sticky bottom-4">
                <Button type="submit" disabled={pending || !isDirty} className="min-w-[150px] shadow-lg">
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

// --- COMPOSANTS UTILITAIRES ---

interface FormInputProps {
    label: string;
    name: string;
    defaultValue?: string;
    error?: string[] | string; 
    placeholder?: string;
}

function FormInput({ label, name, defaultValue, error, placeholder }: FormInputProps) {
    return (
        <div>
            <Field>
                <FieldLabel>{label}</FieldLabel>
                <Input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} />
            </Field>
            {error && <p className="text-red-500 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
        </div>
    )
}

// 2. Date Picker
interface BirthDayPickerProps {
    name: string;
    defaultValue?: Date | null;
    onDateChange?: () => void;
}

function BirthDayPicker({ name, defaultValue, onDateChange }: BirthDayPickerProps) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(defaultValue ? new Date(defaultValue) : undefined)

    return (
        <div className="flex flex-col gap-1.5 flex-1">
            {/* Utilisation de FieldLabel pour la cohérence au lieu de Label Radix */}
            <FieldLabel>Date de naissance</FieldLabel>

            <input type="hidden" name={name} value={date ? date.toISOString() : ''} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-between text-left font-normal mt-1", 
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
                            if (onDateChange) onDateChange();
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