"use client"

import { useActionState, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Loader2, UploadCloud } from "lucide-react" // J'ai ajouté l'icone UploadCloud
import { cn } from "@/src/lib/utils"
import { createMembershipRequest } from "../../memberships.actions"
import { Label } from "@radix-ui/react-label"
import { Switch } from "@/components/ui/swtich" // Attention à votre typo 'swtich' dans le nom du fichier
import { PdfPreviewStep } from "../../service/PdfPreview"

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

const STEPS = [
    { id: 0, title: "Type", fields: ["type"] },
    // On ajoute 'medicalCertificate' aux champs à valider pour l'étape 1
    { id: 1, title: "Infos & Licence", fields: ["ffa", "club", "medicalCertificate", "showPhoneDirectory", "showEmailDirectory"] },
    { id: 2, title: "Paiement", fields: ["paymentMethod"] },
    { id: 3, title: "Signature", fields: [] }
]

export function MembershipForm({ userProfile, season, initialData }: MembershipFormProps) {

    const [state, action, pending] = useActionState(createMembershipRequest, initialState)

    // --- ÉTATS ---
    const [currentStep, setCurrentStep] = useState(0)
    const [signatureData, setSignatureData] = useState<string>("")

    const [formData, setFormData] = useState<any>({
        ...userProfile,
        firstName: userProfile.name,  
        lastName: userProfile.lastname,   
        type: initialData?.type || "INDIVIDUAL",
        paymentMethod: initialData?.payment?.method || "CHECK",
        showPhoneDirectory: initialData ? initialData.sharePhone : true,
        showEmailDirectory: initialData ? initialData.shareEmail : true,
        ffa: initialData?.ffaLicenseNumber || "",
        club: initialData?.previousClub || "",
        signature: ""
    })

    const [hasLicense, setHasLicense] = useState(!!userProfile.ffaNumber);
    const [licenseSource, setLicenseSource] = useState<"RENEWAL" | "MUTATION">("RENEWAL");

    const formRef = useRef<HTMLFormElement>(null)

    // --- HANDLERS ---
    const handleNext = () => {
        if (!formRef.current) return

        const currentFields = STEPS[currentStep].fields
        let isValid = true
        const form = formRef.current

        currentFields.forEach(fieldName => {
            const field = form.elements.namedItem(fieldName) as HTMLInputElement | RadioNodeList
            if (field) {
                // Si le champ existe dans le DOM (donc affiché), on le valide
                if (field instanceof RadioNodeList && field.value === "") {
                    // Validation custom si besoin
                }
                else if (field instanceof HTMLInputElement && !field.checkValidity()) {
                    field.reportValidity()
                    isValid = false
                }
            }
        })

        if (isValid) {
            const currentFormData = new FormData(formRef.current)
            const data = Object.fromEntries(currentFormData.entries())
            setFormData((prev: any) => ({ ...prev, ...data }))
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
        }
    }

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0))
    }

    const isLastStep = currentStep === STEPS.length - 1

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2 relative">
                    {STEPS.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-20">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 font-semibold text-sm bg-white",
                                index < currentStep ? "bg-primary border-primary text-white" :
                                    index === currentStep ? "border-primary text-primary" :
                                        "border-muted text-muted-foreground"
                            )}>
                                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                            </div>
                            <span className={cn(
                                "text-[10px] sm:text-xs mt-1 font-medium text-center absolute -bottom-6 w-max",
                                index === currentStep ? "text-primary" : "text-muted-foreground"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                    <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-0" />
                    <div
                        className="absolute top-4 left-0 h-[2px] bg-primary transition-all duration-300 ease-in-out -z-0"
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            <form action={action} ref={formRef} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm mt-10">

                <input type="hidden" name="signature" value={signatureData} />
                {hasLicense && <input type="hidden" name="licenseType" value={licenseSource} />}

                {state?.message && (
                    <div className={cn(
                        "p-4 rounded-md text-sm mb-4 flex items-center gap-2",
                        state.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {state.message}
                    </div>
                )}

                {/* === ÉTAPE 0 : TYPE D'ADHÉSION === */}
                <div className={cn("space-y-4", currentStep === 0 ? "block" : "hidden")}>
                    <h3 className="text-lg font-medium">Type d'adhésion</h3>
                    <RadioGroup
                        name="type"
                        defaultValue={formData.type || 'INDIVIDUAL'}
                        className="grid grid-cols-1 gap-3"
                    >
                        <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-slate-50">
                            <RadioGroupItem value="INDIVIDUAL" id="t-indi" />
                            <Label htmlFor="t-indi" className="flex-1 cursor-pointer font-normal">Individuel {season.priceStandard} €</Label>
                        </div>
                        <div className="flex items-center space-x-3 border p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-slate-50">
                            <RadioGroupItem value="COUPLE" id="t-couple" />
                            <Label htmlFor="t-couple" className="flex-1 cursor-pointer font-normal">Couple {season.priceCouple} €</Label>
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

                {/* === ÉTAPE 1 : LICENCE & CONSENTEMENTS === */}
                <div className={cn("space-y-6", currentStep === 1 ? "block" : "hidden")}>

                    {/* SECTION : STATUT LICENCE ET DOCUMENT */}
                    <div className="p-2 lg:p-2 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="has-license-switch" className="text-base font-medium">
                                    Êtes-vous déjà licencié FFA ?
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Renouvellement ou Mutation depuis un autre club.
                                </p>
                            </div>
                            <Switch
                                id="has-license-switch"
                                checked={hasLicense}
                                onCheckedChange={setHasLicense}
                            />
                        </div>

                        {/* --- OPTION A : OUI, J'AI UNE LICENCE --- */}
                        {hasLicense ? (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5 pt-4 border-t border-slate-200">
                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold">Votre situation :</Label>
                                    <RadioGroup
                                        value={licenseSource}
                                        onValueChange={(v) => setLicenseSource(v as "RENEWAL" | "MUTATION")}
                                        className="flex flex-col space-y-2"
                                    >
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white">
                                            <RadioGroupItem value="RENEWAL" id="src-renew" />
                                            <Label htmlFor="src-renew" className="font-normal cursor-pointer text-sm">
                                                Je renouvelle aux <strong>Foulées Avrillaises</strong>
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-white">
                                            <RadioGroupItem value="MUTATION" id="src-mut" />
                                            <Label htmlFor="src-mut" className="font-normal cursor-pointer text-sm">
                                                Je viens d'un <strong>autre club</strong> (Mutation)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ffa">Numéro de licence <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="ffa"
                                        name="ffa"
                                        placeholder="Votre n° de licence"
                                        defaultValue={formData.ffa || userProfile.ffaNumber}
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
                                            required={licenseSource === "MUTATION"}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* --- OPTION B : NON, PAS DE LICENCE (Upload Certificat) --- */
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4 pt-4 border-t border-slate-200">
                                <div className="bg-orange-100 border border-orange-200 rounded p-3 text-sm text-orange-800">
                                    <strong>Document requis :</strong> Comme vous n'avez pas de licence active, vous devez fournir un certificat médical de moins d'un an.
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="medicalCertificate" className="flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4" /> Charger votre certificat (PDF/Photo) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="medicalCertificate"
                                        name="medicalCertificate"
                                        type="file"
                                        accept=".pdf,image/*"
                                        required={!hasLicense}
                                        className="cursor-pointer bg-white file:text-primary hover:file:bg-primary/10"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION CONSENTEMENTS (RGPD) */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="text-lg font-medium">Annuaire des adhérents</h3>
                        <p className="text-xs text-muted-foreground">
                            Ces informations seront visibles uniquement par les membres connectés.
                        </p>

                        <div className="space-y-3 p-3 border rounded-md bg-white">
                            <Label className="text-sm font-semibold">
                                Diffuser mon téléphone ? <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                                name="showPhoneDirectory"
                                defaultValue="off"
                                className="flex flex-row gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="on" id="phone-yes" />
                                    <Label htmlFor="phone-yes" className="cursor-pointer font-normal">Oui</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="off" id="phone-no" />
                                    <Label htmlFor="phone-no" className="cursor-pointer font-normal">Non</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-3 p-3 border rounded-md bg-white">
                            <Label className="text-sm font-semibold">
                                Diffuser mon e-mail ? <span className="text-red-500">*</span>
                            </Label>
                            <RadioGroup
                                name="showEmailDirectory"
                                defaultValue="off"
                                className="flex flex-row gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="on" id="email-yes" />
                                    <Label htmlFor="email-yes" className="cursor-pointer font-normal">Oui</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="off" id="email-no" />
                                    <Label htmlFor="email-no" className="cursor-pointer font-normal">Non</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                {/* === ÉTAPE 2 : PAIEMENT === */}
                <div className={cn("space-y-4", currentStep === 2 ? "block" : "hidden")}>
                    <h3 className="text-lg font-medium">Règlement</h3>
                    <div className="space-y-2">
                        <Label>Moyen de paiement</Label>
                        <Select name="paymentMethod" defaultValue={formData.paymentMethod || "TRANSFER"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CHECK">Chèque</SelectItem>
                                <SelectItem value="TRANSFER">Virement Bancaire</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-500 mt-2 bg-slate-50 p-3 rounded border">
                            <strong>Note :</strong> Le paiement sera validé manuellement par le trésorier à réception.
                            <br />Pour les virements, merci d'indiquer "Adhésion 2025 - NOM Prénom" en libellé.
                        </p>
                    </div>
                </div>

                {/* === ÉTAPE 3 : SIGNATURE === */}
                {currentStep === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-medium mb-4">Vérification et Signature</h3>
                        <PdfPreviewStep
                            formData={formData}
                            userProfile={userProfile}
                            onSignatureComplete={(data) => setSignatureData(data)}
                        />
                    </div>
                )}

                {/* === BOUTONS DE NAVIGATION === */}
                <div className="flex justify-between pt-4 border-t mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === 0 || pending}
                        className={currentStep === 0 ? "invisible" : ""}
                    >
                        Précédent
                    </Button>

                    {isLastStep ? (
                        <Button
                            type="submit"
                            className="ml-auto bg-green-600 hover:bg-green-700 w-40"
                            disabled={pending || !signatureData}
                        >
                            {pending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...</>
                            ) : (
                                "Valider et Signer"
                            )}
                        </Button>
                    ) : (
                        <Button type="button" className="ml-auto" onClick={handleNext}>
                            Suivant
                        </Button>
                    )}
                </div>

            </form>
        </div>
    )
}