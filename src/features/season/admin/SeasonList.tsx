import EmptyCategory from "@/components/common/feedback/EmptyCategory";
import { Season } from "@/prisma/generated/prisma/client";
import { Archive } from "lucide-react";

type SeasonWithCount = Season & {
  _count: {
    memberships: number;
  };
};

interface SeasonListProps {
  archivedSeasons: SeasonWithCount[];
}

export default function SeasonList({ archivedSeasons }: SeasonListProps) {
    return (
        <>
            {archivedSeasons.length === 0 ? (
                <EmptyCategory/>
            ):(
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-600">
                        <Archive className="w-5 h-5" /> Historique des saisons
                    </h3>
                    <div className="border rounded-lg bg-white overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3">Saison</th>
                                    <th className="px-4 py-3">Dates</th>
                                    <th className="px-4 py-3 text-center">Adhérents</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {archivedSeasons.map(season => (
                                    <tr key={season.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium">{season.name}</td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {season.startDate.toLocaleDateString("fr-FR")} - {season.endDate.toLocaleDateString("fr-FR")}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {season._count.memberships}
                                        </td>
                                    
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    )
}