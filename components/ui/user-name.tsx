import * as React from "react"
import { cn } from "@/src/lib/utils"

interface UserNameProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string | null
  lastname?: string | null
}

export function UserName({ name, lastname, className, ...props }: UserNameProps) {
  if (!name && !lastname) return null;
  
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} {...props}>
      {name && <span className="font-normal capitalize">{name}</span>}
      {lastname && <span className="font-semibold uppercase">{lastname}</span>}
    </span>
  )
}
