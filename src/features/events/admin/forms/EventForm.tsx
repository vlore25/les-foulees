"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, ChevronDownIcon, UploadCloud, MapPin, Tag, AlignLeft, Ruler } from "lucide-react";
import { useActionState, useState } from "react";
import { getAssetUrl } from "@/src/lib/utils";
import { createEvent, updateEventAction, type EventFormState } from "../../events.actions";
import { Event } from "@/prisma/generated/client";
import DynamicListManager from "./ParticipationManage";
import { Label } from "@/components/ui/Label";
import { TypographyH3, TypographyPageDescription } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { cn } from "@/src/lib/utils";

interface EventFormProps {
    event?: Event | null;
}

export default function EventForm({ event }: EventFormProps) {
    const actionToUse = event
        ? updateEventAction.bind(null, event.id)
        : createEvent;

    const [state, action, pending] = useActionState<EventFormState, FormData>(
        actionToUse,
        undefined
    );

    return (
        <form action={action} className="space-y-8 bg-white p-8 rounded-[2rem] border shadow-sm max-w-3xl" noValidate>
            <div className="space-y-2">
                <TypographyH3 className="text-xl tracking-tight border-b pb-2 text-primary">
                    {event ? "Modifier l'événement" : "Nouvel événement"}
                </TypographyH3>
                <TypographyPageDescription>
                    Remplissez les informations ci-dessous pour {event ? "mettre à jour" : "publier"} un événement.
                </TypographyPageDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TITRE */}
                <div className="space-y-2 flex flex-col">
                    <Label htmlFor="title">
                        Titre de l'événement
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        defaultValue={event?.title || ""}
                        placeholder="Ex: Trail de la Forêt"
                        className="rounded-xl border-primary/10 focus:border-primary/30"
                    />
                    {state?.error?.title && (
                        <p className="text-red-500 text-sm">{state.error.title[0]}</p>
                    )}
                </div>

                {/* LIEU */}
                <div className="space-y-2 flex flex-col">
                    <Label htmlFor="place">
                        Lieu / Localisation
                    </Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                        <Input
                            id="place"
                            name="place"
                            defaultValue={event?.location || ""}
                            placeholder="Ex: Avrillé, Maine-et-Loire"
                            className="pl-10 rounded-xl border-primary/10 focus:border-primary/30"
                        />
                    </div>
                    {state?.error?.place && (
                        <p className="text-red-500 text-sm">{state.error.place[0]}</p>
                    )}
                </div>
            </div>

            {/* DATES */}
            <div className="space-y-3">
                <Label>
                    Dates de l'événement
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground ml-1">Début</span>
                        <EventDatePicker name="dateStart" initialDate={event?.dateStart} />
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground ml-1">Fin (Optionnel)</span>
                        <EventDatePicker name="dateEnd" initialDate={event?.dateEnd} />
                    </div>
                </div>
                {state?.error?.dateStart && (
                    <p className="text-red-500 text-sm">{state.error.dateStart[0]}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TYPE */}
                <div className="space-y-2 flex flex-col">
                    <Label>
                        Type d'activité
                    </Label>
                    <EventTypeSelect name="eventtype" initialValue={event?.type} />
                    {state?.error?.eventtype && (
                        <p className="text-red-500 text-sm">{state.error.eventtype[0]}</p>
                    )}
                </div>

                {/* DISTANCES */}
                <div className="space-y-2 flex flex-col">
                    <Label>
                        Distances / Rôles
                    </Label>
                    <div className="p-4 border border-primary/10 rounded-xl bg-muted/20">
                        <DynamicListManager 
                            name="distances"
                            label="Ajouter des distances (Ex: 10km, Bénévole)"
                            placeholder="Ex: 10km, 5km..."
                            initialItems={event?.distances} 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* REPAS */}
                <div className="space-y-2 flex flex-col">
                    <Label>
                        Options de Repas
                    </Label>
                    <div className="p-4 border border-primary/10 rounded-xl bg-muted/20">
                        <DynamicListManager 
                            name="meals"
                            label="Ajouter des repas (Ex: Repas samedi)"
                            placeholder="Ex: Repas végétarien..."
                            initialItems={event?.meals} 
                        />
                    </div>
                </div>

                {/* HEBERGEMENT */}
                <div className="space-y-2 flex flex-col">
                    <Label>
                        Options d'Hébergement
                    </Label>
                    <div className="p-4 border border-primary/10 rounded-xl bg-muted/20">
                        <DynamicListManager 
                            name="accommodations"
                            label="Ajouter des hébergements (Ex: Nuit du 12)"
                            placeholder="Ex: Nuit Gymnase..."
                            initialItems={event?.accommodations} 
                        />
                    </div>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2 flex flex-col">
                <Label htmlFor="description">
                    Description détaillée
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={event?.description || ""}
                    placeholder="Décrivez l'événement, le programme, les modalités..."
                    className="rounded-xl border-primary/10 focus:border-primary/30 min-h-[120px]"
                />
                {state?.error?.description && (
                    <p className="text-red-500 text-sm">{state.error.description[0]}</p>
                )}
            </div>

            {/* IMAGE */}
            <div className="space-y-4 pt-2">
                <Label htmlFor="picture">
                    <UploadCloud size={16} />
                    Image de couverture
                </Label>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {event?.imgUrl && (
                        <div className="relative w-40 h-24 rounded-2xl overflow-hidden border-2 border-primary/10 shrink-0 shadow-sm">
                            <img
                                src={getAssetUrl(event.imgUrl)}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Actuelle</span>
                            </div>
                        </div>
                    )}

                    <div className="w-full space-y-2">
                        <Input
                            id="picture"
                            name="picture"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className="rounded-xl border-primary/10 cursor-pointer file:bg-primary file:text-white file:font-black file:uppercase file:text-[9px] file:px-4 file:py-2 file:rounded-lg file:border-none"
                        />
                        <p className='text-muted-foreground text-[10px] font-bold italic'>
                            Formats acceptés : JPG, PNG, WEBP. Maximum 5 Mo.
                        </p>
                    </div>
                </div>
                {state?.error?.picture && (
                    <p className="text-red-500 text-sm">{state.error.picture[0]}</p>
                )}
            </div>

            {state?.message && (
                <div className={cn(
                    "p-4 rounded-xl text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in-95 duration-300",
                    state.message.includes('succès') ? "bg-green-500/10 text-green-700 border border-green-200" : "bg-red-500/10 text-red-700 border border-red-200"
                )}>
                    {state.message}
                </div>
            )}

            <Button
                disabled={pending}
                type="submit"
                className="w-full py-6 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-primary/10"
            >
                {pending
                    ? "Enregistrement en cours..."
                    : (event ? "Mettre à jour l'événement" : "Publier l'événement")
                }
            </Button>
        </form>
    );
}

// ----------------------------------------------------------------------
// Composants Helper (DatePicker & Select)
// ----------------------------------------------------------------------

function EventDatePicker({ name, initialDate }: { name: string, initialDate?: Date | null }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined);

    return (
        <>
            <input type="hidden" name={name} value={date ? date.toISOString() : ""} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-between font-bold text-xs uppercase tracking-widest rounded-xl border-primary/10",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <span className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {date ? date.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' }) : <span>Choisir une date</span>}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                            setDate(selectedDate);
                            setOpen(false);
                        }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}

function EventTypeSelect({ name, initialValue }: { name: string, initialValue?: string }) {
    return (
        <Select name={name} defaultValue={initialValue}>
            <SelectTrigger className="w-full rounded-xl border-primary/10 font-bold text-xs uppercase tracking-widest">
                <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectGroup>
                    <SelectLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Sport</SelectLabel>
                    <SelectItem value="TRAIL" className="text-xs font-bold uppercase">Trail</SelectItem>
                    <SelectItem value="COURSE_ROUTE" className="text-xs font-bold uppercase">Course sur route</SelectItem>
                    <SelectItem value="ENTRAINEMENT" className="text-xs font-bold uppercase">Entraînement</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Association</SelectLabel>
                    <SelectItem value="VIE_DU_CLUB" className="text-xs font-bold uppercase">Vie du club</SelectItem>
                    <SelectItem value="SORTIE" className="text-xs font-bold uppercase">Sortie détente</SelectItem>
                    <SelectItem value="AUTRE" className="text-xs font-bold uppercase">Autre</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
