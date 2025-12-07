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
import { createEvent } from "../../actions";


export default function EventForm() {

    const [state, action, pending] = useActionState(createEvent, undefined);
    return (
        <form action={action} className="space-y-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="block text-sm font-medium">
                    Titre
                </label>
                <input
                    id="title"
                    name="title"
                    placeholder="Nom de l'événement"
                    className="border p-2 rounded w-full"
                />
            </div>
            {state?.error?.title && <p className="text-red-500 text-sm">{state.error.title}</p>}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Date</label>
                <EventDatePicker name="dateStart" />
            </div>
            {state?.error?.dateStart && <p className="text-red-500 text-sm">{state.error.dateStart}</p>}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Lieu</label>
                <input
                    id="place"
                    name="place"
                    placeholder="Lieu de l'evenement"
                    className="border p-2 rounded w-full"
                />
            </div>
            {state?.error?.place && <p className="text-red-500 text-sm">{state.error.place}</p>}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Type d'activité</label>
                <EventTypeSelect name="eventtype" />
            </div>
            {state?.error?.eventtype && <p className="text-red-500 text-sm">{state.error.eventtype}</p>}
            <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Description de l'evenement"
                    className="border p-2 rounded w-full"
                />
            </div>
            {state?.error?.description && <p className="text-red-500 text-sm">{state.error.description}</p>}
            <div className="flex flex-col gap-2">
                <label htmlFor="picture" className="block text-sm font-medium">Image de couverture</label>
                <input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="border p-2 rounded w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className='text-muted-foreground text-xs'>
                    Formats acceptés : JPG, PNG, WEBP. Taille maximale : 4 Mo.
                </p>
            </div>
            {state?.error?.picture && <p className="text-red-500 text-sm">{state.error.picture}</p>}

            <Button
                disabled={pending}
                type="submit"
                className="w-full mt-4"
            >
                {pending ? "Enregistrement..." : "Créer l'événement"}
            </Button>
        </form>
    );
}

function EventDatePicker({ name }: { name: string }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    return (
        <>
            <input type="hidden" name={name} value={date ? date.toISOString() : ""} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal text-left"
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

function EventTypeSelect({ name }: { name: string }) {
    return (
        <Select name={name}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de evenement" />
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