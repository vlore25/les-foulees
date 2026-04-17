"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            setIsVisible(true);
        } else if (consent === "accepted") {
            enableTracking();
        }
    }, []);

    const enableTracking = () => {
        // Activer GTM s'il est déjà chargé mais bloqué
        if (typeof window !== "undefined" && (window as any).dataLayer) {
            (window as any).dataLayer.push({ event: "consent_granted" });
        }
    };

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        enableTracking();
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        // Optionnel : GTM gère souvent le refus via des variables de consentement
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] sm:left-auto sm:right-8 sm:max-w-md animate-in slide-in-from-bottom-full duration-500">
            <Card className="p-6 shadow-2xl border-2 border-primary/20 rounded-tl-[2rem] rounded-br-[2rem] bg-white/95 backdrop-blur-md">
                <div className="flex gap-4 items-start">
                    <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                        <Cookie className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-black uppercase tracking-tight text-primary italic">Respect de votre vie privée</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. 
                            Les cookies de session sont essentiels au fonctionnement du site. 
                            <Link href="/about/politique-de-confidentialite" className="text-primary hover:underline ml-1 font-bold">
                                En savoir plus
                            </Link>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <Button 
                                onClick={handleAccept} 
                                className="rounded-tl-xl rounded-br-xl font-bold uppercase tracking-widest text-xs px-6"
                            >
                                Tout accepter
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleDecline}
                                className="rounded-tl-xl rounded-br-xl font-bold uppercase tracking-widest text-xs px-6"
                            >
                                Refuser le tracking
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
