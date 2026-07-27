"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/Label";
import { SearchAllUsers } from "./SearchAllUsers";
import { SearchUser } from "../public/SearchUser";
import { createManualMembershipAction } from "../memberships.actions";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Info, Euro, UserPlus, CreditCard, ShieldCheck, UploadCloud } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { FileInput } from "@/components/ui/file-input";

interface SeasonInfo {
    id: string;
    name: string;
    priceStandard: number;
    priceCouple: number;
    priceYoung: number;
    priceFfa: number;
    isOpenForRegistration: boolean;
}

interface ManualMembershipFormProps {
    seasons: SeasonInfo[];
}

const initialState = {
    message: "",
    success: false,
    errors: {}
};

export function ManualMembershipForm({ seasons }: ManualMembershipFormProps) {
    const router = useRouter();
    const [state, action, pending] = useActionState(createManualMembershipAction, initialState);

    // Form inputs that affect price
    const activeSeason = seasons.find(s => s.isOpenForRegistration) || seasons[0];
    const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id || "");
    const [membershipType, setMembershipType] = useState<string>("INDIVIDUAL");
    const [amount, setAmount] = useState<string>("0");
    const [isAmountDirty, setIsAmountDirty] = useState(false);

    // Track if main and partner are FFA licensed or need medical certificates
    const [hasLicense, setHasLicense] = useState(false);
    const [partnerHasLicense, setPartnerHasLicense] = useState(false);

    // Dynamically calculate and update amount when season/type changes, unless overwritten
    useEffect(() => {
        if (!isAmountDirty && selectedSeasonId) {
            const season = seasons.find(s => s.id === selectedSeasonId);
            if (season) {
                let price = season.priceStandard;
                if (membershipType === "COUPLE") price = season.priceCouple;
                else if (membershipType === "YOUNG") price = season.priceYoung;
                else if (membershipType === "LICENSE_RUNNING") price = season.priceFfa;
                setAmount(price.toString());
            }
        }
    }, [selectedSeasonId, membershipType, seasons, isAmountDirty]);

    // Handle redirection and toast notifications
    useEffect(() => {
        if (state?.success) {
            toast.success(state.message || "Adhésion manuelle créée avec succès !");
            router.push("/admin/adherants");
            router.refresh();
        } else if (state?.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
        setIsAmountDirty(true);
    };

    const handleResetAmount = () => {
        setIsAmountDirty(false);
        // Trigger effect update
        const season = seasons.find(s => s.id === selectedSeasonId);
        if (season) {
            let price = season.priceStandard;
            if (membershipType === "COUPLE") price = season.priceCouple;
            else if (membershipType === "YOUNG") price = season.priceYoung;
            else if (membershipType === "LICENSE_RUNNING") price = season.priceFfa;
            setAmount(price.toString());
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon" className="h-9 w-9 rounded-lg">
                    <Link href="/admin/adherants">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Nouvelle Adhésion Manuelle
                    </h1>
                    <p className="text-sm text-slate-500">
                        Créer directement un dossier d'adhésion et son paiement associé pour un utilisateur.
                    </p>
                </div>
            </div>

            <form action={action} encType="multipart/form-data" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Main Controls */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                        
                        {/* Section 1: User Selection */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-black uppercase tracking-wider text-primary border-b pb-2 flex items-center gap-2">
                                <UserPlus size={16} /> 1. Sélectionner l'adhérent
                            </h2>
                            <div className="space-y-2">
                                <Label>Chercher un compte utilisateur <span className="text-red-500">*</span></Label>
                                <SearchAllUsers />
                                {state?.errors?.userId && (
                                    <p className="text-xs text-red-500 font-bold italic">{state.errors.userId[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Section 2: Adhesion Parameters */}
                        <div className="space-y-4 pt-2">
                            <h2 className="text-sm font-black uppercase tracking-wider text-primary border-b pb-2 flex items-center gap-2">
                                <ShieldCheck size={16} /> 2. Détails de l'adhésion
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="seasonId">Saison de l'adhésion <span className="text-red-500">*</span></Label>
                                    <Select 
                                        name="seasonId" 
                                        value={selectedSeasonId} 
                                        onValueChange={setSelectedSeasonId}
                                    >
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Sélectionner la saison" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seasons.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    Saison {s.name} {s.isOpenForRegistration && "(Active)"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {state?.errors?.seasonId && (
                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.seasonId[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type d'adhésion <span className="text-red-500">*</span></Label>
                                    <Select 
                                        name="type" 
                                        value={membershipType} 
                                        onValueChange={setMembershipType}
                                    >
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue placeholder="Sélectionner le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INDIVIDUAL">Individuel</SelectItem>
                                            <SelectItem value="COUPLE">Couple</SelectItem>
                                            <SelectItem value="YOUNG">Jeune (-18 ans)</SelectItem>
                                            <SelectItem value="LICENSE_RUNNING">Licence Running FFA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {state?.errors?.type && (
                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.type[0]}</p>
                                    )}
                                </div>
                            </div>

                             {/* Section Couple: Partner Selector */}
                            {membershipType === "COUPLE" && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <Label>Chercher le conjoint / partenaire <span className="text-red-500">*</span></Label>
                                        <p className="text-xs text-slate-500 italic">Un deuxième dossier d'adhésion Couple sera automatiquement créé pour ce partenaire.</p>
                                        <SearchUser />
                                        {state?.errors?.partnerUserId && (
                                            <p className="text-xs text-red-500 font-bold italic">{state.errors.partnerUserId[0]}</p>
                                        )}
                                    </div>

                                    {/* Partner details: FFA or Certificate */}
                                    <div className="space-y-4 pt-3 border-t border-slate-200">
                                        <div className="flex items-center justify-between gap-4 p-3 bg-white border rounded-lg shadow-sm">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="partner-has-license-switch" className="text-xs">Partenaire licencié FFA ?</Label>
                                                <p className="text-[10px] text-slate-500 italic">Cochez si le partenaire a déjà une licence active.</p>
                                            </div>
                                            <Switch
                                                id="partner-has-license-switch"
                                                checked={partnerHasLicense}
                                                onCheckedChange={setPartnerHasLicense}
                                                type="button"
                                            />
                                        </div>

                                        {partnerHasLicense ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                                                <div className="space-y-2">
                                                    <Label htmlFor="partnerFfaLicenseNumber">N° licence FFA du partenaire</Label>
                                                    <Input
                                                        id="partnerFfaLicenseNumber"
                                                        name="partnerFfaLicenseNumber"
                                                        placeholder="Ex: 1234567"
                                                        className="rounded-lg bg-white"
                                                    />
                                                    {state?.errors?.partnerFfaLicenseNumber && (
                                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.partnerFfaLicenseNumber[0]}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="partnerPreviousClub">Club précédent du partenaire</Label>
                                                    <Input
                                                        id="partnerPreviousClub"
                                                        name="partnerPreviousClub"
                                                        placeholder="Nom du club"
                                                        className="rounded-lg bg-white"
                                                    />
                                                    {state?.errors?.partnerPreviousClub && (
                                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.partnerPreviousClub[0]}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 animate-in fade-in duration-200">
                                                <FileInput
                                                    id="partnerMedicalCertificate"
                                                    name="partnerMedicalCertificate"
                                                    accept=".pdf,image/*"
                                                    label="Attestation PPS du partenaire (Optionnel)"
                                                />
                                                {state?.errors?.partnerMedicalCertificate && (
                                                    <p className="text-xs text-red-500 font-bold italic">{state.errors.partnerMedicalCertificate[0]}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Details Adhérent Principal */}
                            <div className="space-y-4 pt-2 border-t border-slate-100">
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                    Dossier Adhérent Principal
                                </h3>
                                
                                <div className="flex items-center justify-between gap-4 p-3 bg-slate-50 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="has-license-switch" className="text-xs">Licencié FFA ?</Label>
                                        <p className="text-[10px] text-slate-500 italic">Cochez si l'adhérent a déjà une licence active.</p>
                                    </div>
                                    <Switch
                                        id="has-license-switch"
                                        checked={hasLicense}
                                        onCheckedChange={setHasLicense}
                                        type="button"
                                    />
                                </div>

                                {hasLicense ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                                        <div className="space-y-2">
                                            <Label htmlFor="ffaLicenseNumber">Numéro de licence FFA</Label>
                                            <Input
                                                id="ffaLicenseNumber"
                                                name="ffaLicenseNumber"
                                                placeholder="Ex: 1234567"
                                                className="rounded-lg"
                                            />
                                            {state?.errors?.ffaLicenseNumber && (
                                                <p className="text-xs text-red-500 font-bold italic">{state.errors.ffaLicenseNumber[0]}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="previousClub">Club précédent / mutation</Label>
                                            <Input
                                                id="previousClub"
                                                name="previousClub"
                                                placeholder="Nom du club"
                                                className="rounded-lg"
                                            />
                                            {state?.errors?.previousClub && (
                                                <p className="text-xs text-red-500 font-bold italic">{state.errors.previousClub[0]}</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 animate-in fade-in duration-200">
                                        <FileInput
                                            id="medicalCertificate"
                                            name="medicalCertificate"
                                            accept=".pdf,image/*"
                                            label="Charger l'attestation PPS (Optionnel)"
                                        />
                                        {state?.errors?.medicalCertificate && (
                                            <p className="text-xs text-red-500 font-bold italic">{state.errors.medicalCertificate[0]}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 3: Payment Configuration */}
                        <div className="space-y-4 pt-2">
                            <h2 className="text-sm font-black uppercase tracking-wider text-primary border-b pb-2 flex items-center gap-2">
                                <CreditCard size={16} /> 3. Règlement & Cotisation
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Moyen de règlement <span className="text-red-500">*</span></Label>
                                    <Select name="paymentMethod" defaultValue="CASH">
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CASH">Espèces</SelectItem>
                                            <SelectItem value="CHECK">Chèque</SelectItem>
                                            <SelectItem value="TRANSFER">Virement Bancaire</SelectItem>
                                            <SelectItem value="ONLINE">En ligne</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {state?.errors?.paymentMethod && (
                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.paymentMethod[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="paymentStatus">Statut du paiement <span className="text-red-500">*</span></Label>
                                    <Select name="paymentStatus" defaultValue="PAID">
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PAID">Payé</SelectItem>
                                            <SelectItem value="PENDING">En attente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {state?.errors?.paymentStatus && (
                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.paymentStatus[0]}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="membershipStatus">Statut de l'adhésion <span className="text-red-500">*</span></Label>
                                    <Select name="membershipStatus" defaultValue="VALIDATED">
                                        <SelectTrigger className="rounded-lg">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VALIDATED">Validée (Actif)</SelectItem>
                                            <SelectItem value="PENDING">À vérifier (En attente)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {state?.errors?.membershipStatus && (
                                        <p className="text-xs text-red-500 font-bold italic">{state.errors.membershipStatus[0]}</p>
                                    )}
                                </div>
                            </div>

                            {/* Custom Amount field */}
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="amount" className="flex items-center gap-1">
                                    Montant de la cotisation (€) <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={handleAmountChange}
                                            className="pl-9 rounded-lg"
                                        />
                                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                    {isAmountDirty && (
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleResetAmount}
                                            className="text-xs text-primary font-bold hover:bg-slate-50"
                                        >
                                            Réinitialiser
                                        </Button>
                                    )}
                                </div>
                                {state?.errors?.amount && (
                                    <p className="text-xs text-red-500 font-bold italic">{state.errors.amount[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar summary / Submit button */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 sticky top-6">
                        <h3 className="font-black text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                            <Info size={16} /> Synthèse
                        </h3>

                        <div className="space-y-3 text-sm divide-y divide-slate-100">
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Saison :</span>
                                <span className="font-bold text-slate-800">
                                    {seasons.find(s => s.id === selectedSeasonId)?.name || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Type d'offre :</span>
                                <span className="font-bold text-slate-800">
                                    {membershipType === "INDIVIDUAL" && "Individuelle"}
                                    {membershipType === "COUPLE" && "Couple"}
                                    {membershipType === "YOUNG" && "Jeune"}
                                    {membershipType === "LICENSE_RUNNING" && "Licence FFA"}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                                <span className="text-slate-500">Montant total :</span>
                                <span className="text-lg font-black text-slate-900 flex items-center">
                                    {parseFloat(amount || "0").toFixed(2)} €
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 leading-relaxed flex gap-2">
                            <Info size={16} className="shrink-0 mt-0.5" />
                            <span>
                                L'adhésion créée manuellement n'exige pas d'attestation PPS. Le paiement est généré instantanément selon vos choix.
                            </span>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={pending} 
                            className="w-full py-6 rounded-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer l'adhésion"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
