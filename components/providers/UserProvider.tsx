"use client";

import { BaseUser } from "@/src/lib/dto";
import { createContext, useContext, ReactNode } from "react";

const UserContext = createContext<BaseUser | null>(null);

export default function UserProvider({
  children,
  user
}: {
  children: ReactNode;
  user: BaseUser | null;
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