"use client";

import { registerUser } from "@/src/features/auth/auth.actions";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react"; // Import useState
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, getAssetUrl } from "@/src/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Label } from "@/components/ui/Label";
import ErrorText from "@/components/common/feedback/ErrorText";
import ErrorBox from "@/components/common/feedback/ErrorBox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const STEPS = [
  {
    id: 0,
    title: "Identité",
    fields: ["name", "lastname", "genre", "phone", "birthdate"],
  },
  { id: 1, title: "Adresse", fields: ["address", "zip-code", "city"] },
  {
    id: 2,
    title: "Contact d'urgence",
    fields: ["emergencyName", "emergencyLastName", "emergencyPhone"],
  },
  { id: 3, title: "Sécurité", fields: ["password", "confirmPassword"] },
];

export default function RegistrationForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [state, action, pending] = useActionState(registerUser, undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (state?.success) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 bg-green-50 border border-green-200 rounded-xl flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">
          Inscription réussie !
        </h2>
        <p className="text-green-700 text-sm">
          Votre compte a été créé avec succès.
        </p>
        <Button
          asChild
          className="bg-green-600 hover:bg-green-700 text-white mt-4 uppercase font-bold tracking-widest text-xs py-6"
        >
          <Link href="/login">Accéder à la connexion</Link>
        </Button>
      </div>
    );
  }

  const handleNext = () => {
    const currentFields = STEPS[currentStep].fields;
    let isValid = true;

    currentFields.forEach((fieldName) => {
      const input = document.querySelector(
        `[name="${fieldName}"]`,
      ) as HTMLInputElement;
      if (input && !input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 relative px-2">
          <div className="absolute top-4.5 left-0 w-full h-[2px] bg-slate-100 -z-10" />
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 bg-white px-1 sm:px-2"
            >
              <div
                className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 font-black text-[10px] sm:text-xs",
                  index < currentStep
                    ? "bg-primary border-primary text-white scale-90" // Passé
                    : index === currentStep
                      ? "border-primary text-primary bg-white scale-110 shadow-lg shadow-primary/20" // Actuel
                      : "border-slate-200 text-slate-400 bg-white", // Futur
                )}
              >
                {index < currentStep ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden md:block text-[10px] mt-2 font-black uppercase tracking-widest transition-colors duration-300",
                  index === currentStep ? "text-primary" : "text-slate-400",
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-700 ease-in-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {state?.message && !state.success && (
        <div className="mb-6">
          <ErrorBox error={state.message}></ErrorBox>
        </div>
      )}

      <form
        action={action}
        className="flex flex-col gap-8 min-h-[450px]"
        noValidate
        encType="multipart/form-data"
      >
        <input type="hidden" name="token" value={token} />

        {/* ÉTAPE 0 : IDENTITÉ */}
        <div
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-right-4 duration-500",
            currentStep === 0 ? "block" : "hidden",
          )}
        >
          <div className="flex sm:flex-col lg:flex-row justify-center lg:justify-start">
            <div className="flex flex-col items-center gap-4">
              <label className="cursor-pointer group relative">
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl transition-all group-hover:scale-105 group-active:scale-95">
                  {previewUrl && (
                    <AvatarImage
                      src={previewUrl}
                      alt="Photo de profil"
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-slate-100 flex flex-col items-center justify-center">
                    <User className="w-10 h-10 text-slate-300" />
                    <span className="text-[10px] text-slate-400 uppercase font-black mt-1">
                      Photo
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                    <Upload className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                  Photo de profil
                </p>
              </div>
              <ErrorText>{state?.errors?.profileImage}</ErrorText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Field>
                <FieldLabel>Prénom</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Jean"
                  defaultValue={state?.fields?.name}
                  required
                />
              </Field>
              <ErrorText>{state?.errors?.name}</ErrorText>
            </div>
            <div className="space-y-2">
              <Field>
                <FieldLabel>Nom</FieldLabel>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Ex: DUPONT"
                  defaultValue={state?.fields?.lastname}
                  required
                />
              </Field>
              <ErrorText>{state?.errors?.lastname}</ErrorText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-1 space-y-2">
              <Field>
                <FieldLabel>Genre</FieldLabel>
                <GenreSelect
                  genre="genre"
                  initialValue={state?.fields?.genre}
                />
              </Field>
              <ErrorText>{state?.errors?.genre}</ErrorText>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Field>
                <FieldLabel>Téléphone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="06 12 34 56 78"
                  defaultValue={state?.fields?.phone}
                  required
                />
              </Field>
              <ErrorText>{state?.errors?.phone}</ErrorText>
            </div>
          </div>

          <div className="space-y-2">
            <BirthDayPicker
              name="birthdate"
              initialValue={state?.fields?.birthdate}
            />
            <ErrorText>{state?.errors?.birthdate}</ErrorText>
          </div>
        </div>

        {/* ÉTAPE 1 : ADRESSE */}
        <div
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-right-4 duration-500",
            currentStep === 1 ? "block" : "hidden",
          )}
        >
          <div className="space-y-2">
            <Field>
              <FieldLabel className="text-xs font-black uppercase tracking-widest">
                Adresse postale
              </FieldLabel>
              <Input
                id="address"
                name="address"
                placeholder="N° et nom de votre rue"
                defaultValue={state?.fields?.address}
                required
              />
            </Field>
            <ErrorText>{state?.errors?.address}</ErrorText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Code Postal
                </FieldLabel>
                <Input
                  id="zip-code"
                  name="zip-code"
                  placeholder="49240"
                  defaultValue={state?.fields?.zipCode}
                />
              </Field>
              <ErrorText>{state?.errors?.zipCode}</ErrorText>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Ville
                </FieldLabel>
                <Input
                  id="city"
                  name="city"
                  placeholder="Ex: Avrillé"
                  defaultValue={state?.fields?.city}
                />
              </Field>
              <ErrorText>{state?.errors?.city}</ErrorText>
            </div>
          </div>
        </div>

        {/* ÉTAPE 2 : CONTACT D'URGENCE */}
        <div
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-right-4 duration-500",
            currentStep === 2 ? "block" : "hidden",
          )}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
              Contact d'urgence
            </h2>
            <p className="text-sm text-slate-500 italic">
              Indispensable pour votre sécurité lors des entraînements et
              courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Prénom du contact
                </FieldLabel>
                <Input
                  name="emergencyName"
                  placeholder="Ex: Marie"
                  defaultValue={state?.fields?.emergencyName}
                  className="h-12 rounded-xl"
                />
              </Field>
              <ErrorText>{state?.errors?.emergencyName}</ErrorText>
            </div>
            <div className="space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Nom du contact
                </FieldLabel>
                <Input
                  name="emergencyLastName"
                  placeholder="Ex: DUPONT"
                  defaultValue={state?.fields?.emergencyLastName}
                  className="h-12 rounded-xl"
                />
              </Field>
              <ErrorText>{state?.errors?.emergencyLastName}</ErrorText>
            </div>
          </div>
          <div className="space-y-2">
            <Field>
              <FieldLabel className="text-xs font-black uppercase tracking-widest">
                Téléphone d'urgence
              </FieldLabel>
              <Input
                name="emergencyPhone"
                placeholder="06 .. .. .. .."
                defaultValue={state?.fields?.emergencyPhone}
                className="h-12 rounded-xl"
              />
            </Field>
            <ErrorText>{state?.errors?.emergencyPhone} </ErrorText>
          </div>
        </div>

        {/* ÉTAPE 3 : SÉCURITÉ */}
        <div
          className={cn(
            "space-y-6 animate-in fade-in slide-in-from-right-4 duration-500",
            currentStep === 3 ? "block" : "hidden",
          )}
        >
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
              Sécuriser votre compte
            </h2>
            <p className="text-sm text-slate-500 italic">
              Choisissez un mot de passe robuste pour protéger vos données.
            </p>
          </div>

          <Field>
            <FieldLabel className="text-xs font-black uppercase tracking-widest">
              Adresse Courriel
            </FieldLabel>
            <Input
              id="email"
              name="email"
              value={email}
              readOnly
              className="h-12 rounded-xl bg-slate-50 text-slate-500 font-bold border-slate-200"
            />
            <p className="text-[10px] text-slate-400 italic mt-1.5 px-1">
              Cette adresse est liée à votre invitation et ne peut être
              modifiée.
            </p>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Mot de passe
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue={state?.fields?.password}
                  className="h-12 rounded-xl"
                />
              </Field>
              <ErrorText>{state?.errors?.password} </ErrorText>
            </div>
            <div className="space-y-2">
              <Field>
                <FieldLabel className="text-xs font-black uppercase tracking-widest">
                  Confirmer
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  defaultValue={state?.fields?.confirmPassword}
                  required
                  className="h-12 rounded-xl"
                />
              </Field>
              <ErrorText>{state?.errors?.confirmPassword}</ErrorText>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                Confidentialité de l'annuaire
              </p>
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                Ces informations ne seront visibles que par les membres
                authentifiés de l'association.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <Checkbox
                  id="showPhoneDirectory"
                  name="showPhoneDirectory"
                  defaultChecked={state?.fields?.showPhoneDirectory === true}
                  className="w-5 h-5 rounded-md"
                />
                <Label
                  htmlFor="showPhoneDirectory"
                >
                  Diffuser mon numéro
                </Label>
              </div>
              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <Checkbox
                  id="showEmailDirectory"
                  name="showEmailDirectory"
                  defaultChecked={state?.fields?.showEmailDirectory === true}
                  className="w-5 h-5 rounded-md"
                />
                <Label
                  htmlFor="showEmailDirectory"
                >
                  Diffuser mon courriel
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 mt-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group transition-colors hover:bg-slate-50">
            <Checkbox
              id="terms-conditions"
              name="terms-conditions"
              required
              className="mt-1 w-5 h-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all group-hover:border-primary/50"
            />
            <label
              htmlFor="terms-conditions"
              className="text-sm leading-relaxed text-slate-600 cursor-pointer select-none"
            >
              J'accepte les{" "}
              <Link
                href="/mentions-legales"
                target="_blank"
                className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                Conditions Générales
              </Link>{" "}
              et la{" "}
              <Link
                href="/politique-de-confidentialite"
                target="_blank"
                className="text-primary font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                Politique de Confidentialité
              </Link>{" "}
              de l'association.
            </label>
          </div>
          <ErrorText>{state?.errors?.terms}</ErrorText>
        </div>

        {/* --- NAVIGATION --- */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={cn(
              "font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl hover:bg-slate-50",
              currentStep === 0 && "invisible",
            )}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Retour
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              key="next-button"
              type="button"
              onClick={handleNext}
              className="font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Suivant <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              key="submit-button"
              type="submit"
              disabled={pending}
              className="font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95 bg-primary"
            >
              {pending ? "Création..." : "Finaliser l’inscription"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function BirthDayPicker({
  name,
  initialValue,
}: {
  name: string;
  initialValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialValue ? new Date(initialValue) : undefined,
  );

  return (
    <div className="flex flex-col gap-2.5">
      <FieldLabel>Date de naissance</FieldLabel>
      <input type="hidden" name={name} value={date ? date.toISOString() : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className={cn(
              "w-full h-12 justify-between text-left font-bold rounded-md border-slate-200 px-4",
              !date && "text-slate-400 font-normal",
            )}
          >
            {date
              ? date.toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Sélectionner une date"}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50 text-primary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-2xl shadow-2xl border-slate-100"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setOpen(false);
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            captionLayout="dropdown"
            fromYear={1920}
            toYear={new Date().getFullYear()}
            className="rounded-2xl"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function GenreSelect({
  genre,
  initialValue,
}: {
  genre: string;
  initialValue?: string;
}) {
  return (
    <Select name={genre} defaultValue={initialValue}>
      <SelectTrigger className="w-full border-slate-200 font-bold">
        <SelectValue placeholder="Genre" />
      </SelectTrigger>
      <SelectContent className="rounded-xl shadow-xl border-slate-100">
        <SelectGroup>
          <SelectItem
            value="FEMALE"
            className="font-bold text-sm py-3 rounded-lg"
          >
            Femme
          </SelectItem>
          <SelectItem
            value="MALE"
            className="font-bold text-sm py-3 rounded-lg"
          >
            Homme
          </SelectItem>
          <SelectItem
            value="OTHER"
            className="font-bold text-sm py-3 rounded-lg"
          >
            Autre
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
