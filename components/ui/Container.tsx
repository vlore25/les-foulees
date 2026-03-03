import { cn } from "@/src/lib/utils";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Permet d'ajouter des classes spécifiques si besoin
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div 
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", 
        className
      )}
    >
      {children}
    </div>
  );
};