"use client";

import { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  role: string; 
  name?: string;
  lastname?: string;
} | null;

const UserContext = createContext<User>(null);

export default function UserProvider({ 
  children, 
  user 
}: { 
  children: ReactNode; 
  user: User; 
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