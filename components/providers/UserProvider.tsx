"use client";

import { CurrentUser } from "@/src/lib/dto";
import { createContext, useContext, ReactNode } from "react";

const UserContext = createContext<CurrentUser | null>(null);

export default function UserProvider({
  children,
  user
}: {
  children: ReactNode;
  user: CurrentUser;
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