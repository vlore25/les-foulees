"use client";

import { ReactNode } from "react";

interface MembershipManagerProps {
  children: ReactNode;
}

export default function MembershipTabsManager({ children }: MembershipManagerProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
       {children}
    </div>
  );
}