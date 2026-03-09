import * as React from "react"
import { cn } from "@/src/lib/utils"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
}

function Title({
  className,
  ...props
}: TitleProps) {
  return (
    <div className="py-2">
    <h2
      data-slot="title"
      className={cn(
        "flex items-center gap-2",
        "text-3xl sm:text-3xl font-bold tracking-tight text-title select-none ",
        className
      )}
      {...props}

    />
    <div className="h-1 lg:h-1.5 w-32 bg-primary"></div>
    </div>
  )
}

export { Title }