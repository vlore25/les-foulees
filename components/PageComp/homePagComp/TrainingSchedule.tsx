import { Card } from "@/components/ui/card";
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
        <section className="my-10 max-w-6xl mx-auto px-4 ">
            <Title className="lg:">
                Nos séances d'entraînement :
            </Title>
            <p className="text-italic md:text-xl">Deux groupes le mardi selon le nombre de coureurs</p>
            {/*Mobile cards*/}
            <ul className="flex flex-col gap-7 mt-5  ">
                {tableItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <div className="relative w-full h-48 lg:w-72 lg:h-40 overflow-visible sm:hidden">
                                <Image
                                    src={item.img}
                                    fill
                                    alt={item.day}
                                    className="rounded-tl-2xl rounded-br-2xl object-cover"
                                >
                                </Image>
                                <article className="font-semibold bg-primary-300 rounded-tl-2xl rounded-br-2xl w-fit p-1 text-primary-700 absolute -bottom-5 -left-2 ">
                                    <h4 className="text-primary-700 font-bold text-xl">
                                        {item.day}
                                    </h4>
                                    <div>
                                        <div className="flex flex-row items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <p>
                                                {item.hour}
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <p>
                                                {item.place}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            <div className=" hidden sm:block sm:grid grid-cols-5 sm:gap-5 items-center text-primary-700">
                                <div className="relative w-full h-48 lg:w-80 lg:h-40 overflow-visible col-span-2">
                                    <Image
                                        src={item.img}
                                        fill
                                        alt={item.day}
                                        className="rounded-tl-2xl rounded-br-2xl object-cover"
                                    >
                                    </Image>
                                </div>
                                <h4 className="text-primary-700 font-bold text-4xl">
                                    {item.day}
                                </h4>
                                <div className="flex flex-row items-center gap-2 text-2xl">
                                    <Clock className="w-6 h-6" />
                                    <p>
                                        {item.hour}
                                    </p>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-2xl">
                                    <MapPin className="w-10 h-10" />
                                    <p>
                                        {item.place}
                                    </p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    );
}