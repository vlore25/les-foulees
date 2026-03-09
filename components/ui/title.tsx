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
          "transition-all duration-300"
        )}
        {...props}
      >
        {children}
      </h2>
      
      {!noLine && (
        <div 
          className={cn(
            "h-1 lg:h-1.5 bg-primary mt-1",
            "w-2/3 group-hover:w-full transition-all duration-500 ease-in-out", 
            "rounded-tr-full rounded-br-full" 
          )} 
        />
      )}
    </div>
  )
}

export { Title }