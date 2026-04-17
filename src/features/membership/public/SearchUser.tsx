"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { searchPartnerByName } from "../../users/user.action";
import { Loader2, Search, User, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface UserSearchResult {
    id: string;
    name: string;
    email: string;
}

export function SearchUser() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Ne pas lancer de recherche si l'utilisateur est déjà sélectionné
        if (selectedUser && query === `${selectedUser.name} (${selectedUser.email})`) {
            setOpen(false);
            return;
        }

        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    const data = await searchPartnerByName(query);
                    setResults(data);
                    setOpen(true);
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, selectedUser]);

    const handleSelect = (user: UserSearchResult) => {
        setSelectedUser(user);
        setQuery(`${user.name} (${user.email})`);
        setOpen(false);
    };

    return (
        <div className="relative">
            <input type="hidden" name="partnerUserId" value={selectedUser?.id || ""} />
            
            <div className="relative">
                <Input
                    placeholder="Tapez le nom ou prénom..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (selectedUser) setSelectedUser(null);
                    }}
                    className={cn(
                        "pl-10 pr-10",
                        selectedUser && "border-green-500 bg-green-50 text-green-900 font-semibold"
                    )}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </div>
                {selectedUser && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                        <Check className="w-4 h-4" />
                    </div>
                )}
            </div>

            {open && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <ul className="max-h-60 overflow-y-auto py-1">
                        {results.map((user) => (
                            <li 
                                key={user.id}
                                onClick={() => handleSelect(user)}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors border-b last:border-0 border-slate-50"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {open && query.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
                    Aucun utilisateur trouvé.
                </div>
            )}
        </div>
    );
}
