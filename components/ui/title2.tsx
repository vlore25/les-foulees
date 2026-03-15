

import * as React from "react"
import { cn } from "@/src/lib/utils"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string
  noLine?: boolean 
}

function Title2({
  className,
  noLine = false,
  children,
  ...props
}: TitleProps) {
  return (
    <div className={cn("py-2 w-fit group", className)}>
      <h2
        data-slot="title2"
        className={cn(
          "text-primary-500 text-md sm:text-2xl font-black tracking-tighter select-none",
        )}
        {...props}
      >
        {children}
      </h2>
    </div>
  )
}

export { Title2 }