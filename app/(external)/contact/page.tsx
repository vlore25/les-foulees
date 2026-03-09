"use client"

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Title } from '@/components/ui/title';
import { MapPin, Mail, LucideIcon, Phone, Rss } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from '@/components/ui/quote';
import { ContactForm } from '@/components/PageComp/ContactPagComp/ContactForm';
import { SiFacebook } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

import dynamic from "next/dynamic";

const Map = dynamic(() => import('@/components/PageComp/ContactPagComp/MapLeaf'), { ssr:false });

type ContactDetailItem = {
    icon: LucideIcon;
    title: string;
    content: React.ReactNode;
};

const CONTACT_DETAILS: ContactDetailItem[] = [
    {
        icon: MapPin,
        title: "Notre Adresse",
        content: (
            <address className="not-italic text-muted-foreground leading-relaxed">
                Stade Auguste Delaune<br />
                Rond Point du Général de Gaulle<br />
                49240 Avrillé
            </address>
        ),
    },
    {
        icon: Mail,
        title: "Email",
        content: (
            <p className="text-muted-foreground">
                <a
                    href="mailto:contact@lesfouleesavrillaises.fr"
                    className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                    contact@lesfouleesavrillaises.fr
                </a>
            </p>
        ),
    },
    {
        icon: SiFacebook,
        title: "Nous suivre",
        content: (
            <Link
            href="https://www.facebook.com/lesfouleesavrillaises"
            >
            Facebook
            </Link>
        ),
    },
];


const ContactInfoRow = ({ item }: { item: ContactDetailItem }) => (
    <div className="flex items-start space-x-2">
        <div className="p-3 bg-primary-500 rounded-tl-xl rounded-br-xl shadow-md">
            <item.icon className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="font-semibold text-lg pt-0">{item.title}</h3>
            {item.content}
        </div>
    </div>
);

// --- 4. Composant Principal de la Page ---
export default function ContactPage() {
    return (
        <Container>
            <div className="mb-10 space-y-4">
                <Title>Contactez-nous</Title>
                <Quote>
                    Que vous soyez débutant ou confirmé, n'hésitez pas à nous contacter pour obtenir plus d'informations sur le club, les entraînements ou les adhésions.
                </Quote>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card >
                        <CardContent className="py-4 px-4 space-y-6">
                            {CONTACT_DETAILS.map((detail, index) => (
                                <ContactInfoRow key={index} item={detail} />
                            ))}
                            
                            <Map />
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <ContactForm />
                </div>
            </div>
        </Container>
    );
}