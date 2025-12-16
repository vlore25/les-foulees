"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

interface SeasonFilterProps {
  seasons: { id: string; name: string; isActive: boolean }[];
  currentSeasonId?: string;
}

export default function SeasonFilter({ seasons, currentSeasonId }: SeasonFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (seasonId: string) => {
    const params = new URLSearchParams(searchParams);
    if (seasonId) {
      params.set("seasonId", seasonId);
    } else {
      params.delete("seasonId");
    }
    // On remplace l'URL, ce qui va recharger la Server Component parente
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="w-[200px]">
      <Select 
        defaultValue={currentSeasonId} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir une saison" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name} {s.isActive && "(Active)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}