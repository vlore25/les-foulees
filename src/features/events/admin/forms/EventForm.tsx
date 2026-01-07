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
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useActionState, useState } from "react";
import Image from "next/image";
import { createEvent, updateEventAction, type EventFormState } from "../../events.actions";
import { Event } from "@/prisma/generated/prisma/client";

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
        <form action={action} className="space-y-6 max-w-2xl" noValidate>
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Titre
                </label>
                <input
                    id="title"
                    name="title"
                    defaultValue={event?.title || ""}
                    placeholder="Nom de l'événement"
                    className="border p-2 rounded w-full bg-background"
                />
                {state?.error?.title && (
                    <p className="text-red-500 text-sm">{state.error.title[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Date de début</label>
                <EventDatePicker name="dateStart" initialDate={event?.dateStart} />
                <EventDatePicker name="dateEnd" initialDate={event?.dateEnd} />
                {state?.error?.dateStart && (
                    <p className="text-red-500 text-sm">{state.error.dateStart[0]}</p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="place" className="block text-sm font-medium">Lieu</label>
                <input
                    id="place"
                    name="place"
                    defaultValue={event?.location || ""}
                    placeholder="Lieu de l'événement"
                    className="border p-2 rounded w-full bg-background"
                />
                {state?.error?.place && (
                    <p className="text-red-500 text-sm">{state.error.place[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Type d'activité</label>
                <EventTypeSelect name="eventtype" initialValue={event?.type} />
                {state?.error?.eventtype && (
                    <p className="text-red-500 text-sm">{state.error.eventtype[0]}</p>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={event?.description || ""}
                    placeholder="Description détaillée..."
                    className="border p-2 rounded w-full min-h-[120px] bg-background"
                />
                {state?.error?.description && (
                    <p className="text-red-500 text-sm">{state.error.description[0]}</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="picture" className="block text-sm font-medium">
                    Image de couverture {event && <span className="text-xs text-muted-foreground font-normal">(Laisser vide pour conserver l'actuelle)</span>}
                </label>

                {event?.imgUrl && (
                    <div className="relative w-32 h-20 mb-2 rounded overflow-hidden border">
                        <Image
                            src={event.imgUrl}
                            alt="Image actuelle"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="border p-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 bg-background"
                />
                <p className='text-muted-foreground text-xs'>
                    Formats : JPG, PNG, WEBP. Max 4 Mo.
                </p>
                {state?.error?.picture && (
                    <p className="text-red-500 text-sm">{state.error.picture[0]}</p>
                )}
            </div>
            {state?.message && (
                <div className={`p-3 rounded text-sm ${state.message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {state.message}
                </div>
            )}

            <Button
                disabled={pending}
                type="submit"
                className="w-full mt-4"
            >
                {pending
                    ? "Enregistrement..."
                    : (event ? "Modifier l'événement" : "Créer l'événement")
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
                        className={`w-full justify-between font-normal text-left ${!date && "text-muted-foreground"}`}
                    >
                        <span className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                            {date ? date.toLocaleDateString("fr-FR") : <span>Choisir une date</span>}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Sport</SelectLabel>
                    <SelectItem value="TRAIL">Trail</SelectItem>
                    <SelectItem value="COURSE_ROUTE">Course sur route</SelectItem>
                    <SelectItem value="ENTRAINEMENT">Entraînement</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Association</SelectLabel>
                    <SelectItem value="VIE_DU_CLUB">Vie du club (Repas, Fêtes)</SelectItem>
                    <SelectItem value="SORTIE">Sortie détente</SelectItem>
                    <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}