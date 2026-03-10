import { Card } from "@/components/ui/card";
import { Quote } from "@/components/ui/quote";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Title } from "@/components/ui/title";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function TrainingSchedule() {

    const tableItems = [
        {
            day: "Mardi  et jeudi",
            hour: "18h30/20h00",
            place: "Parking du Stade Delaune",
            img: "/images/training/training1.jpg"
        },
        {
            day: "Mercredi",
            hour: "8h45",
            place: "Parking de Netto à Avrillé",
            img: "/images/training/training2.jpg"
        },
        {
            day: "Samedi",
            hour: "8h45/10h30",
            place: "Devant la Mairie d'Avrillé",
            img: "/images/training/training3.jpeg"
        },
    ];

    return (
        <section className="my-16 max-w-6xl mx-auto px-4">
            <Title className="mb-2">
                Nos séances d'entraînement
            </Title>
            <Quote>
                Deux groupes le mardi selon le nombre de coureurs
            </Quote>
            <ul className="flex flex-col gap-12">
                {tableItems.map((item, index) => (
                    <li key={index} className="group">
                        
                        <div className="relative w-full h-52 sm:hidden  ">
                            <Image
                                src={item.img}
                                fill
                                alt={item.day}
                                className="rounded-tl-[2rem] rounded-br-[2rem] object-cover shadow-md"
                            />
                            <article className="bg-primary-300 rounded-tl-2xl rounded-br-2xl w-fit p-3 text-primary-900 absolute -bottom-6 -left-2 shadow-lg">
                                <h4 className="font-bold text-xl leading-none mb-2 uppercase tracking-tight">
                                    {item.day}
                                </h4>
                                <div className="space-y-1 text-sm font-medium opacity-90">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{item.hour}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{item.place}</span>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <div className="hidden sm:grid grid-cols-12 gap-8 items-center p-4 rounded-br-[3rem] transition-colors hover:bg-primary-50/50">
                            
                            <div className="relative h-40 col-span-3 overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] shadow-sm group-hover:shadow-md transition-shadow">
                                <Image
                                    src={item.img}
                                    fill
                                    alt={item.day}
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            <div className="col-span-3">
                                <h4 className="text-primary-700 font-black text-3xl lg:text-4xl uppercase italic tracking-tighter group-hover:text-primary-500 transition-colors">
                                    {item.day}
                                </h4>
                            </div>

                            <div className="col-span-2 flex items-center gap-3 text-primary-700/80">
                                <Clock className="w-6 h-6 text-primary-400" />
                                <p className="text-xl font-semibold italic">{item.hour}</p>
                            </div>
                            <div className="col-span-4 flex items-center gap-3 text-primary-700/80">
                                <MapPin className="w-6 h-6 text-primary-400 shrink-0" />
                                <p className="text-lg font-medium leading-tight">{item.place}</p>
                            </div>
                            
                        </div>
                    </li>
                    
                ))}
            </ul>
        </section>
    );
}