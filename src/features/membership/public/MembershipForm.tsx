"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, UploadCloud, FileText } from "lucide-react" 
import { cn } from "@/src/lib/utils"
import { createMembershipRequest } from "../memberships.actions"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/switch"
import { SearchUser } from "./SearchUser"
import { TypographyH3, TypographyP } from "@/components/ui/typography"

interface MembershipFormProps {
    userProfile: any;
    season: any
    initialData?: any; 
}

const initialState = {
    message: "",
    success: false,
    errors: {}
}

export function MembershipForm({ userProfile, season, initialData }: MembershipFormProps) {

    const [state, action, pending] = useActionState(createMembershipRequest, initialState)
    const [membershipType, setMembershipType] = useState(initialData?.type || 'INDIVIDUAL')

    const [hasLicense, setHasLicense] = useState(
        initialData ? !!initialData.ffaLicenseNumber : !!userProfile.ffaNumber
    );
    const [licenseSource, setLicenseSource] = useState<"RENEWAL" | "MUTATION">(
        initialData?.licenseType || "RENEWAL"
    );

    // Un partenaire invité est identifié par la présence d'un partnerId (il est lié à l'adhésion principale)
    const isInvitedPartner = initialData && !!initialData.partnerId;

    return (
            <form action={action} className="space-y-8 bg-white p-6 rounded-2xl border shadow-sm">

                {initialData?.id && <input type="hidden" name="membershipId" value={initialData.id} />}
                
                {hasLicense && <input type="hidden" name="licenseType" value={licenseSource} />}

                {state?.message && (
                    <div className={cn(
                        "p-4 rounded-xl text-sm flex items-center gap-2",
                        state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {state.message}
                    </div>
                )}

                {/* Section Type d'adhésion : cachée pour le partenaire invité car déjà définie, ou désactivée si correction */}
                {!isInvitedPartner ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-black uppercase tracking-tight border-b pb-2 text-primary">1. Type d'adhésion</h3>
                        
                        {initialData && (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                                <p className="text-xs font-bold text-amber-700 uppercase">Modification de dossier</p>
                                <p className="text-[10px] text-amber-600 italic">Le type d'adhésion ne peut plus être modifié une fois la demande soumise.</p>
                            </div>
                        )}

                        <RadioGroup
                            name="type"
                            value={membershipType}
                            onValueChange={setMembershipType}
                            disabled={!!initialData}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                            <div className={cn(
                                "flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5",
                                !!initialData && "opacity-60 cursor-not-allowed"
                            )}>
                                <RadioGroupItem value="INDIVIDUAL" id="t-indi" disabled={!!initialData} />
                                <Label htmlFor="t-indi">Individuel {season.priceStandard} €</Label>
                            </div>
                            <div className={cn(
                                "flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5",
                                !!initialData && "opacity-60 cursor-not-allowed"
                            )}>
                                <RadioGroupItem value="COUPLE" id="t-couple" disabled={!!initialData} />
                                <Label htmlFor="t-couple">Couple {season.priceCouple} €</Label>
                            </div>
                            <div className={cn(
                                "flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5",
                                !!initialData && "opacity-60 cursor-not-allowed"
                            )}>
                                <RadioGroupItem value="YOUNG" id="t-young" disabled={!!initialData} />
                                <Label htmlFor="t-young">Jeune -18 ans {season.priceYoung} €</Label>
                            </div>
                            <div className={cn(
                                "flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5",
                                !!initialData && "opacity-60 cursor-not-allowed"
                            )}>
                                <RadioGroupItem value="LICENSE_RUNNING" id="t-run" disabled={!!initialData} />
                                <Label htmlFor="t-run">Licence Running FFA {season.priceFfa} €</Label>
                            </div>
                        </RadioGroup>
                        {initialData && <input type="hidden" name="type" value={membershipType} />}
                        {state?.errors?.type && <p className="text-xs text-red-500 font-bold italic">{state.errors.type[0]}</p>}

                        {membershipType === "COUPLE" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 space-y-3 border-t border-dashed mt-4">
                                <Label>Chercher votre conjoint(e) <span className="text-red-500">*</span></Label>
                                <p className="text-xs text-muted-foreground italic">Votre partenaire doit déjà avoir un compte sur le site.</p>
                                
                                {initialData ? (
                                    <div className="p-3 bg-slate-50 border rounded-xl text-xs font-bold text-slate-500">
                                        Partenaire déjà lié.
                                    </div>
                                ) : (
                                    <>
                                        <SearchUser />
                                        {state?.errors?.partnerUserId && (
                                            <p className="text-xs text-red-500 font-bold italic">{state.errors.partnerUserId[0]}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                            <div className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-tight border-b pb-2 text-primary">1. Type d'adhésion</h3>
                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
                            <p className="text-sm font-bold text-primary uppercase">Offre Couple</p>
                            <p className="text-xs text-slate-600 italic">Adhésion groupée avec votre partenaire.</p>
                            <input type="hidden" name="type" value="COUPLE" />
                            </div>
                            </div>
                            )}

                            <div className="space-y-6 pt-2">
                            <h3 className="text-lg font-black uppercase tracking-tight border-b pb-2 text-primary">2. Infos & Licence</h3>
                            <div className="space-y-4">
                            <div className="flex items-center justify-between gap-4 p-4 bg-muted/20 rounded-xl">
                            <div className="space-y-0.5">
                                <Label htmlFor="has-license-switch">Êtes-vous déjà licencié FFA ?</Label>
                                <p className="text-[10px] text-muted-foreground italic">Renouvellement ou Mutation depuis un autre club.</p>
                            </div>
                            <Switch
                                id="has-license-switch"
                                checked={hasLicense}
                                onCheckedChange={setHasLicense}
                                type="button"
                            />
                            </div>

                            {hasLicense ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5 pt-4">
                                <div className="space-y-3">
                                    <Label>Votre situation :</Label>
                                    <RadioGroup
                                        value={licenseSource}
                                        onValueChange={(v) => setLicenseSource(v as "RENEWAL" | "MUTATION")}
                                        className="flex flex-col sm:flex-row gap-3"
                                    >
                                       <div className="flex items-center space-x-2 border p-3 rounded-xl bg-white flex-1 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                                            <RadioGroupItem value="RENEWAL" id="src-renew" />
                                            <Label htmlFor="src-renew">Renouvellement</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-xl bg-white flex-1 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                                            <RadioGroupItem value="MUTATION" id="src-mut" />
                                            <Label htmlFor="src-mut">Mutation (Autre club)</Label>
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
                                        className="rounded-xl"
                                    />
                                    {state?.errors?.ffaLicenseNumber && <p className="text-xs text-red-500 font-bold italic">{state.errors.ffaLicenseNumber[0]}</p>}
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
                                            className="rounded-xl"
                                        />
                                        {state?.errors?.previousClub && <p className="text-xs text-red-500 font-bold italic">{state.errors.previousClub[0]}</p>}
                                    </div>
                                )}
                            </div>
                            ) : (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pt-4">
                                {initialData?.certificateUrl && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3 text-primary font-bold">
                                            <FileText className="w-5 h-5" />
                                            <span className="uppercase text-xs tracking-tighter">Certificat déjà fourni</span>
                                        </div>
                                        <a href={initialData.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase text-primary hover:underline underline-offset-4">
                                            Consulter
                                        </a>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="medicalCertificate">
                                        <UploadCloud className="w-4 h-4" /> 
                                        {initialData?.certificateUrl ? "Mettre à jour le certificat" : "Charger votre certificat"} 
                                        {!initialData?.certificateUrl && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Input
                                        id="medicalCertificate"
                                        name="medicalCertificate"
                                        type="file"
                                        accept=".pdf,image/*"
                                        required={!hasLicense && !initialData?.certificateUrl}
                                        className="cursor-pointer bg-white file:bg-primary file:text-white file:font-bold file:uppercase file:text-[10px] file:px-4 file:py-2 file:rounded-lg file:border-none rounded-xl"
                                    />
                                    {state?.errors?.medicalCertificate && <p className="text-xs text-red-500 font-bold italic">{state.errors.medicalCertificate[0]}</p>}
                                </div>
                            </div>
                            )}
                            </div>
                            </div>

                            {!isInvitedPartner ? (
                            <div className="space-y-4 pt-2">
                            <TypographyH3 className="border-b pb-2">3. Règlement</TypographyH3>
                            <div className="space-y-2">
                            <Label>Moyen de paiement</Label>
                            <Select name="paymentMethod" defaultValue={initialData?.paymentMethod || initialData?.payment?.method || "TRANSFER"}>
                                <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Choisir..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CHECK">Chèque</SelectItem>
                                    <SelectItem value="TRANSFER">Virement Bancaire</SelectItem>
                                </SelectContent>
                            </Select>
                            {state?.errors?.paymentMethod && <p className="text-xs text-red-500 font-bold italic">{state.errors.paymentMethod[0]}</p>}
                            </div>
                            </div>
                            ) : (
                            // On garde un input hidden pour le paymentMethod pour la validation Zod
                            <input type="hidden" name="paymentMethod" value={initialData?.payment?.method || "TRANSFER"} />
                            )}                <div className="pt-6">
                    <Button type="submit" disabled={pending} className="w-full py-6 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {pending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Traitement...</> : initialData ? "Mettre à jour ma demande" : "Soumettre mon adhésion"}
                    </Button>
                </div>
            </form>
    )
}
