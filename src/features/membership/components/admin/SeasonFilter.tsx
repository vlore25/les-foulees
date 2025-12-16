"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

interface SeasonFilterProps {
  seasons: { id: string; name: string; isActive: boolean }[];
  currentSeasonId?: string;
}

export default function SeasonFilter({ seasons, currentSeasonId }: SeasonFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticSeasonId, setOptimisticSeasonId] = useState(currentSeasonId);


  useEffect(() => {
    setOptimisticSeasonId(currentSeasonId);
  }, [currentSeasonId]);

  const handleValueChange = (seasonId: string) => {
    setOptimisticSeasonId(seasonId);
    const params = new URLSearchParams(searchParams);
    if (seasonId) {
      params.set("seasonId", seasonId);
    } else {
      params.delete("seasonId");
    }
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="w-[250px]">
      <Select 
        value={optimisticSeasonId || ""}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir une saison" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {/* On coupe le texte s'il est trop long */}
              <span className="truncate block max-w-[200px]">
                  {s.name || "Saison sans nom"} {s.isActive && "(Active)"}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}