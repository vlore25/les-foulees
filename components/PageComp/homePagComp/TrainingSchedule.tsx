import { Title } from "@/components/ui/title";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";

import { getTrainingSchedules } from "@/src/features/site-config/dal";
import EmptyCategory from "@/components/common/feedback/EmptyCategory";

export default async function TrainingSchedule() {

    let tableItems = await getTrainingSchedules();
    console.log(tableItems)
    if (tableItems.length === 0) {
        return (
            <EmptyCategory emptyIcon={Calendar} text="Horaires des entraînements bientôt disponibles" />
        )
    } else {
        return (

            <section className="my-16 max-w-6xl mx-auto px-4">
                <Title className="mb-2">
                    Nos séances d'entraînement
                </Title>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                    {tableItems.map((item, index) => {
                        return (
                            <li key={index} className="group relative rounded-tl-[2rem] rounded-br-[2rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="relative w-full h-48 overflow-hidden">
                                    <Image
                                        src={item.imgUrl || "/images/training/training1.jpg"}
                                        fill
                                        alt={item.day}
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent"></div>
                                    <h4 className="absolute bottom-4 left-6 font-black text-3xl text-white uppercase tracking-tight drop-shadow-md">
                                        {item.day}
                                    </h4>
                                </div>
                                
                                <div className="p-6 relative bg-white">
                                    <div className="space-y-4 text-slate-700 font-medium">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg">{item.hour}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <span className="text-lg leading-tight">{item.place}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </section>
        );
    }

}