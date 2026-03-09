import { cn } from "@/src/lib/utils";
import React from "react";

interface QuoteProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function Quote({ children, className, ...props }: QuoteProps) {
  return (
    <p
      className={cn(
        "border-l-4 border-primary-300 pl-4 italic text-muted-foreground md:text-xl",
        "mb-10",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}