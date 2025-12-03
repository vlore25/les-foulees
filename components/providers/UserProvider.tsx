"use client";
import { createContext, useContext, ReactNode } from "react";
import type { CurrentUser } from "@/src/lib/dal";

const UserContext = createContext<CurrentUser | null>(null);

export default function UserProvider({ 
  children, 
  user 
}: { 
  children: ReactNode; 
  user: CurrentUser | null;
}) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  return context;
}