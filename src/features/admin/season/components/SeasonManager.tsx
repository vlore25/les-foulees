'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"

type SeasonWithCount = {
    id: string
    name: string
    startDate: Date
    endDate: Date
    isActive: boolean
    priceStandard: number
    priceCouple: number
    priceYoung: number
    priceFfa: number
    _count: { licenses: number } // <--- NOUVEAU
}
export const SeasonManager = ({ seasons }: { seasons: SeasonWithCount[] }) => {

    return (
        <Card>
            <CardContent>
                <div className="space-y-4">
                    {seasons.map((season) => (
                        <div key={season.id} className="flex items-center justify-between border p-4 rounded-lg">
                            <div>
                                <div className="gap-0">
                                    <h3 className="font-bold text-lg">{season.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(season.startDate), 'dd/MM/yyyy')} - {format(new Date(season.endDate), 'dd/MM/yyyy')}
                                    </p>
                                </div>
                                <p>{season._count.licenses ? season._count.licenses : "Pas de inscrit dans cette season"}</p>
                                <div className="flex flex-wrap gap-3 text-xs mt-2 text-gray-700">
                                    <Badge className="bg-gray-300 text-black">
                                        Std: <b>{season.priceStandard}€</b>
                                    </Badge>
                                    <Badge className="bg-gray-300 text-black">
                                        Couple: <b>{season.priceCouple}€</b>
                                    </Badge>
                                    <Badge className="bg-gray-300 text-black">
                                        Jeune: <b>{season.priceYoung}€</b>
                                    </Badge>
                                    <Badge className="bg-gray-300 text-black">
                                        FFA: <b>{season.priceFfa}€</b>
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}