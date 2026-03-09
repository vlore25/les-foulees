import * as React from "react"
import { cn } from "@/src/lib/utils"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  noLine?: boolean 
}

function Title({
  className,
  noLine = false,
  children,
  ...props
}: TitleProps) {
  return (
    <div className={cn("py-4 w-fit group", className)}>
      <h2
        data-slot="title"
        className={cn(
          "text-3xl sm:text-4xl font-black tracking-tighter text-title select-none uppercase",
        )}
        {...props}
      >
        {children}
      </h2>
    </div>
  )
}

export { Title }