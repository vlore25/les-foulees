'use client'

import { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn, getAssetUrl } from '@/src/lib/utils'
import { updateProfile } from '../../user.action'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import SuccesBox from '@/components/common/feedback/SuccesBox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'


interface ProfileFormProps {
    defaultValues: {
        id: string;
        name: string;
        lastname: string;
        genre?: string | null;
        profileImageUrl?: string | null;
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

    const [showPhone, setShowPhone] = useState(defaultValues.showPhoneDirectory);
    const [showEmail, setShowEmail] = useState(defaultValues.showEmailDirectory);

    const [previewUrl, setPreviewUrl] = useState<string | null>(getAssetUrl(defaultValues.profileImageUrl));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("L'image est trop volumineuse (maximum 5 Mo).");
                e.target.value = "";
                return;
            }
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsDirty(true);
        }
    };

    console.log(defaultValues)



    useEffect(() => {
        setShowPhone(defaultValues.showPhoneDirectory);
        setShowEmail(defaultValues.showEmailDirectory);
        setPreviewUrl(getAssetUrl(defaultValues.profileImageUrl));
    }, [defaultValues.showPhoneDirectory, defaultValues.showEmailDirectory, defaultValues.profileImageUrl]);

    const handleFormChange = () => {
        if (!isDirty) setIsDirty(true);
    };


    return (
        <form action={action} onChange={handleFormChange} className="space-y-8 max-w-4xl pb-10" noValidate>


            <div className="flex flex-col md:flex-row gap-6  md:items-start mb-8">
                <div className="relative group">
                    <label className="cursor-pointer block relative">
                        <Avatar className="w-24 h-24 border-2 border-primary/10 transition-all group-hover:border-primary/30">
                            <AvatarImage src={getAssetUrl(previewUrl)} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                                {defaultValues.name?.[0]}{defaultValues.lastname?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <span className="text-white text-[10px] font-bold uppercase">Modifier</span>
                        </div>
                        <input
                            type="file"
                            name="profileImage"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </label>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold capitalize">{defaultValues.name} {defaultValues.lastname}</h1>
                    <p className="text-muted-foreground">{defaultValues.email}</p>
                    {state?.message && state.success &&
                        <SuccesBox message={state?.message} />
                    }
                    <p className="text-xs text-muted-foreground mt-2 italic">
                        Cliquez sur l'avatar pour modifier votre photo.
                    </p>
                    {state?.error?.profileImage && <p className="text-red-500 text-xs mt-1">{state?.error?.profileImage[0]}</p>}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 px-2">
                <article className='md:col-span-2'>
                    <p className='font-semibold text-xl mb-1'>Informations Personnelles</p>
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <FormInput
                                label="Prénom" name="name"
                                defaultValue={defaultValues.name} error={state?.error?.name}
                            />
                            <FormInput
                                label="Nom" name="lastname"
                                defaultValue={defaultValues.lastname} error={state?.error?.lastname}
                            />
                            <div>
                                <FieldLabel>Genre</FieldLabel>
                                <GenreSelect
                                    name="genre"
                                    defaultValue={defaultValues.genre || ''}
                                    onValueChange={() => setIsDirty(true)}
                                />
                                {state?.error?.genre && <p className="text-red-500 text-xs mt-1">{state?.error?.genre[0]}</p>}
                            </div>
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
                    </div>
                </article>

                <article className='md:col-span-2'>
                    <p className='font-semibold text-xl mb-1'>Adresse</p>
                    <div className="space-y-4">
                        <FormInput
                            label="Numéro et nom de la rue" name="address"
                            defaultValue={defaultValues.address || ''} error={state?.error?.address}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <FormInput
                                    label="Code postal" name="zipCode"
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
                    </div>
                </article>

                <article className='md:col-span-2'>
                    <p className='font-semibold text-xl mb-1'>Contact d'urgence</p>
                    <p className="text-muted-foreground text-xs">Personne à contacter en cas de problème.</p>
                    {(!defaultValues.emergencyName || !defaultValues.emergencyPhone) && (
                        <p className='text-orange-600 text-xs mt-1 font-medium'>
                            Pensez à renseigner un contact à prévenir !
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                            label="Prénom" name="emergencyName"
                            defaultValue={defaultValues.emergencyName || ''}
                        />
                        <FormInput
                            label="Nom" name="emergencyLastName"
                            defaultValue={defaultValues.emergencyLastName || ''}
                        />
                        <FormInput
                            label="Téléphone d'urgence" name="emergencyPhone"
                            defaultValue={defaultValues.emergencyPhone || ''} error={state?.error?.emergencyPhone}
                        />
                    </div>

                </article>
                <article className='space-y-2'>
                    <p className='font-semibold text-xl mb-1'>Annuaire des adhérents</p>
                    <p className="text-muted-foreground text-xs">Ces informations seront visibles uniquement par les membres connectés.</p>

                    <input type="hidden" name="showPhoneDirectory" value={showPhone ? 'on' : 'off'} />
                    <input type="hidden" name="showEmailDirectory" value={showEmail ? 'on' : 'off'} />

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showPhoneDirectory"
                            checked={showPhone}
                            onCheckedChange={(checked) => {
                                setShowPhone(checked === true);
                                setIsDirty(true);
                            }}
                        />
                        <Label htmlFor="showPhoneDirectory">Diffuser mon téléphone</Label>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="showEmailDirectory"
                            checked={showEmail}
                            onCheckedChange={(checked) => {
                                setShowEmail(checked === true);
                                setIsDirty(true);
                            }}
                        />
                        <Label htmlFor="showEmailDirectory">Diffuser mon Courriel</Label>
                    </div>
                </article>

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
        </form >
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

function GenreSelect({ name, defaultValue, onValueChange }: { name: string, defaultValue?: string, onValueChange?: (value: string) => void }) {
    return (
        <Select name={name} defaultValue={defaultValue} onValueChange={onValueChange}>
            <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Indiquer votre genre" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Genre</SelectLabel>
                    <SelectItem value="FEMALE">Femme</SelectItem>
                    <SelectItem value="MALE">Homme</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

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
                        autoFocus
                        captionLayout="dropdown"
                        startMonth={new Date(1920, 0)}
                        toYear={new Date().getFullYear()}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}