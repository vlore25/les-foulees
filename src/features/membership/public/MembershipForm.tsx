"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, UploadCloud, FileText } from "lucide-react" // Ajout de FileText
import { cn } from "@/src/lib/utils"
import { createMembershipRequest } from "../memberships.actions"
import { Label } from "@radix-ui/react-label"
import { Switch } from "@/components/ui/swtich"

interface MembershipFormProps {
    userProfile: any;
    season: any
    initialData?: any; // Contient les données du dossier refusé
}

const initialState = {
    message: "",
    success: false,
    errors: {}
}

export function MembershipForm({ userProfile, season, initialData }: MembershipFormProps) {

    const [state, action, pending] = useActionState(createMembershipRequest, initialState)

    // 1. Initialisation des états avec initialData s'il existe
    const [hasLicense, setHasLicense] = useState(
        initialData ? !!initialData.ffaLicenseNumber : !!userProfile.ffaNumber
    );
    const [licenseSource, setLicenseSource] = useState<"RENEWAL" | "MUTATION">(
        initialData?.licenseType || "RENEWAL"
    );

    return (
        <div className="w-full max-w-lg mx-auto">
            <form action={action} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm mt-6">

                {/* 2. On passe l'ID de la demande pour que le backend sache qu'il faut Mettre à jour et non Créer */}
                {initialData?.id && <input type="hidden" name="membershipId" value={initialData.id} />}
                
                {hasLicense && <input type="hidden" name="licenseType" value={licenseSource} />}

                {/* Message de succès ou d'erreur global */}
                {state?.message && (
                    <div className={cn(
                        "p-4 rounded-md text-sm flex items-center gap-2",
                        state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {state.message}
                    </div>
                )}

                {/* --- SECTION 1 : TYPE D'ADHÉSION --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">1. Type d'adhésion</h3>
                    {/* Le defaultValue fait déjà très bien le travail ici */}
                    <RadioGroup
                        name="type"
                        defaultValue={initialData?.type || 'INDIVIDUAL'}
                        className="grid grid-cols-1 gap-3"
                    >
                        {/* ... (Vos RadioGroupItems ne changent pas) ... */}
                        <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-slate-50">
                            <RadioGroupItem value="INDIVIDUAL" id="t-indi" />
                            <Label htmlFor="t-indi" className="flex-1 cursor-pointer font-normal">Individuel {season.priceStandard} €</Label>
                        </div>
                        <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-slate-50">
                            <RadioGroupItem value="YOUNG" id="t-young" />
                            <Label htmlFor="t-young" className="flex-1 cursor-pointer font-normal">Jeune -18 ans {season.priceYoung} €</Label>
                        </div>
                        <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-slate-50">
                            <RadioGroupItem value="LICENSE_RUNNING" id="t-run" />
                            <Label htmlFor="t-run" className="flex-1 cursor-pointer font-normal">Licence Running FFA {season.priceFfa} €</Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* --- SECTION 2 : INFOS & LICENCE --- */}
                <div className="space-y-6 pt-2">
                    <h3 className="text-lg font-medium border-b pb-2">2. Infos & Licence</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="has-license-switch" className="text-base font-medium">Êtes-vous déjà licencié FFA ?</Label>
                                <p className="text-xs text-muted-foreground">Renouvellement ou Mutation depuis un autre club.</p>
                            </div>
                            <Switch
                                id="has-license-switch"
                                checked={hasLicense}
                                onCheckedChange={setHasLicense}
                                type="button"
                            />
                        </div>

                        {hasLicense ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5 pt-4 border-t border-slate-200">
                                {/* Le composant RadioGroup de la situation doit être "contrôlé" ou avoir un defaultValue pour pré-remplir */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold">Votre situation :</Label>
                                    <RadioGroup
                                        value={licenseSource}
                                        onValueChange={(v) => setLicenseSource(v as "RENEWAL" | "MUTATION")}
                                        className="flex flex-col space-y-2"
                                    >
                                       {/* ... Vos RadioGroupItems ... */}
                                       <div className="flex items-center space-x-2 border p-3 rounded-md bg-white">
                                            <RadioGroupItem value="RENEWAL" id="src-renew" />
                                            <Label htmlFor="src-renew" className="font-normal cursor-pointer text-sm">Je renouvelle aux <strong>Foulées Avrillaises</strong></Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white">
                                            <RadioGroupItem value="MUTATION" id="src-mut" />
                                            <Label htmlFor="src-mut" className="font-normal cursor-pointer text-sm">Je viens d'un <strong>autre club</strong> (Mutation)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ffa">Numéro de licence <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="ffa"
                                        name="ffa"
                                        placeholder="Votre n° de licence"
                                        defaultValue={initialData?.ffaLicenseNumber || userProfile.ffaNumber || ""}
                                        required={hasLicense}
                                    />
                                </div>

                                {licenseSource === "MUTATION" && (
                                    <div className="space-y-2 animate-in fade-in pl-4 border-l-2 border-primary">
                                        <Label htmlFor="club">Ancien club <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="club"
                                            name="club"
                                            placeholder="Nom du club précédent"
                                            defaultValue={initialData?.previousClub || ""}
                                            required={licenseSource === "MUTATION"}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pt-4 border-t border-slate-200">
                                
                                {/* 3. GESTION DU CERTIFICAT PRÉCÉDENT */}
                                {initialData?.medicalCertificateUrl && (
                                    <div className="bg-slate-50 border rounded-md p-3 flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span>Document déjà fourni</span>
                                        </div>
                                        <a href={initialData.medicalCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            Voir le fichier
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="medicalCertificate" className="flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4" /> 
                                        {initialData?.medicalCertificateUrl ? "Remplacer le certificat (Optionnel)" : "Charger votre certificat"} 
                                        {!initialData?.medicalCertificateUrl && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id="medicalCertificate"
                                        name="medicalCertificate"
                                        type="file"
                                        accept=".pdf,image/*"
                                        // Le champ n'est requis que s'il n'y a pas déjà un document
                                        required={!hasLicense && !initialData?.medicalCertificateUrl}
                                        className="cursor-pointer bg-white file:text-primary hover:file:bg-primary/10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- SECTION 3 : RÈGLEMENT --- */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-medium border-b pb-2">3. Règlement</h3>
                    <div className="space-y-2">
                        <Label>Moyen de paiement</Label>
                        <Select name="paymentMethod" defaultValue={initialData?.paymentMethod || initialData?.payment?.method || "TRANSFER"}>
                            {/* ... */}
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CHECK">Chèque</SelectItem>
                                <SelectItem value="TRANSFER">Virement Bancaire</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* ... */}
                    </div>
                </div>

                {/* --- BOUTON DE SOUMISSION --- */}
                <div className="pt-6 mt-8">
                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...</> : "Mettre à jour ma demande"}
                    </Button>
                </div>
            </form>
        </div>
    )
}