"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { TypographyH2, TypographyH3, TypographyPageDescription, TypographyP } from "@/components/ui/typography";
import { updateSiteConfigAction, upsertTrainingScheduleAction, deleteTrainingScheduleAction, uploadHeroImagesAction } from "../actions";
import { Loader2, Plus, Trash2, Save, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export function SiteConfigManager({ initialConfig, initialSchedules }: { initialConfig: any, initialSchedules: any[] }) {
    const [savingHero, setSavingHero] = useState(false);
    const [schedules, setSchedules] = useState(initialSchedules);
    const [savingScheduleId, setSavingScheduleId] = useState<string | null>(null);

    const handleSaveHero = async (formData: FormData) => {
        setSavingHero(true);
        const res = await uploadHeroImagesAction(formData);
        setSavingHero(false);
        if (res.success) {
            toast.success("Images mises à jour !");
            window.location.reload();
        } else {
            toast.error(res.message || "Erreur lors de l'upload.");
        }
    };

    const handleScheduleChange = (index: number, field: string, value: string) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setSchedules(newSchedules);
    };

    const handleSaveSchedule = async (schedule: any, index: number, formElement: HTMLFormElement) => {
        if (!schedule.day || !schedule.hour || !schedule.place) {
            toast.error("Veuillez remplir le jour, l'heure et le lieu.");
            return;
        }
        setSavingScheduleId(schedule.id || `temp-${index}`);
        
        const formData = new FormData(formElement);
        if (schedule.id) formData.append("id", schedule.id);
        formData.append("order", schedule.order?.toString() || index.toString());

        const res = await upsertTrainingScheduleAction(formData);
        if (res.success) {
            toast.success("Horaire sauvegardé avec succès !");
            // Refresh to get real IDs for new items
            if (!schedule.id) setTimeout(() => window.location.reload(), 1500);
        } else {
            toast.error("Erreur lors de la sauvegarde.");
        }
        setSavingScheduleId(null);
    };

    const handleDeleteSchedule = async (id: string, index: number) => {
        if (id) {
            await deleteTrainingScheduleAction(id);
        }
        setSchedules(schedules.filter((_, i) => i !== index));
        toast.success("Horaire supprimé.");
    };

    const handleAddSchedule = () => {
        setSchedules([...schedules, { day: "", hour: "", place: "", imgUrl: "", order: schedules.length }]);
    };

    return (
        <div className="space-y-6">
            {/* HERO SECTION */}
            <section className="space-y-6">
                <div>
                    <TypographyH2>Images d'accueil (Hero)</TypographyH2>
                    <TypographyPageDescription className="mt-1">
                        Personnalisez les images de la page d'accueil.
                    </TypographyPageDescription>
                </div>
                <form action={handleSaveHero} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Image Grand Écran (Desktop)</Label>
                            <Input 
                                type="file" 
                                name="heroDesktop" 
                                accept="image/*" 
                                className="cursor-pointer file:bg-primary file:text-white file:rounded-md file:border-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Image Téléphone (Mobile)</Label>
                            <Input 
                                type="file" 
                                name="heroMobile" 
                                accept="image/*" 
                                className="cursor-pointer file:bg-primary file:text-white file:rounded-md file:border-none"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={savingHero}>
                        {savingHero && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Uploader & Enregistrer les images
                    </Button>
                </form>
            </section>

            {/* SCHEDULES SECTION */}
            <section className="space-y-6 pt-6 border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <TypographyH2>Horaires d'entraînement</TypographyH2>
                        <TypographyPageDescription className="mt-1">
                            Ajoutez ou supprimez les créneaux d'entraînement proposés par le club.
                        </TypographyPageDescription>
                    </div>
                    <Button onClick={handleAddSchedule} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Ajouter un horaire
                    </Button>
                </div>

                <div className="space-y-6">
                    {schedules.map((schedule, index) => (
                        <form 
                            key={schedule.id || index} 
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-slate-100 bg-slate-50 rounded-xl items-end"
                            onSubmit={(e) => { e.preventDefault(); handleSaveSchedule(schedule, index, e.currentTarget); }}
                        >
                            <div className="md:col-span-3 space-y-2">
                                <Label>Jour (ex: Mardi et jeudi)</Label>
                                <Input name="day" value={schedule.day} onChange={(e) => handleScheduleChange(index, "day", e.target.value)} required />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Heures (ex: 18h30)</Label>
                                <Input name="hour" value={schedule.hour} onChange={(e) => handleScheduleChange(index, "hour", e.target.value)} required />
                            </div>
                            <div className="md:col-span-3 space-y-2">
                                <Label>Lieu (ex: Stade)</Label>
                                <Input name="place" value={schedule.place} onChange={(e) => handleScheduleChange(index, "place", e.target.value)} required />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>Nouvelle Image</Label>
                                <Input type="file" name="imgFile" accept="image/*" className="cursor-pointer file:bg-primary file:text-white file:rounded-md file:border-none" />
                            </div>
                            <div className="md:col-span-2 flex gap-2">
                                <Button 
                                    type="submit"
                                    className="flex-1" 
                                    disabled={savingScheduleId === (schedule.id || `temp-${index}`)}
                                >
                                    {savingScheduleId === (schedule.id || `temp-${index}`) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" variant="destructive" className="flex-1">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Supprimer cet horaire ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action supprimera définitivement cet horaire d'entraînement du site.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteSchedule(schedule.id, index)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                Supprimer
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </form>
                    ))}
                    {schedules.length === 0 && <TypographyP className="text-muted-foreground text-sm">Aucun horaire configuré.</TypographyP>}
                </div>
            </section>

            {/* TEXTES LEGAUX SECTION */}
            <section className="space-y-6 pt-6 border-slate-200">
                <div>
                    <TypographyH2>Textes Légaux</TypographyH2>
                    <TypographyPageDescription className="mt-1">
                        Gérez la politique de confidentialité et les mentions légales de l'association. Ces pages sont obligatoires et accessibles par tous les visiteurs.
                    </TypographyPageDescription>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <TypographyH3>Politique de Confidentialité</TypographyH3>
                            <p className="text-sm text-muted-foreground mt-1">Explications sur la gestion des données, formulaires, RGPD.</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/admin/parametres/confidentialite">Modifier</Link>
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <TypographyH3>Mentions Légales</TypographyH3>
                            <p className="text-sm text-muted-foreground mt-1">Informations sur l'association (SIRET, Adresse) et l'hébergement.</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/admin/parametres/mentions-legales">Modifier</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
