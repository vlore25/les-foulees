import * as React from "react"
import { cn } from "@/src/lib/utils"

export const TypographyH1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn("text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-primary leading-tight", className)} {...props} />
))
TypographyH1.displayName = "TypographyH1"

export const TypographyH2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-xl sm:text-2xl font-bold tracking-tight text-slate-800 leading-tight", className)} {...props} />
))
TypographyH2.displayName = "TypographyH2"

export const TypographyH3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg sm:text-xl font-bold text-slate-800 leading-tight first-letter:uppercase", className)} {...props} />
))
TypographyH3.displayName = "TypographyH3"

export const TypographyH4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn("font-black text-sm italic capitalize", className)} {...props} />
))
TypographyH4.displayName = "TypographyH4"

export const TypographyP = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground/90 font-medium leading-relaxed", className)} {...props} />
))
TypographyP.displayName = "TypographyP"

export const TypographyDetail = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("text-xs font-semibold text-muted-foreground italic", className)} {...props} />
))
TypographyDetail.displayName = "TypographyDetail"

export const TypographyPageDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground font-normal leading-relaxed max-w-3xl", className)} {...props} />
))
TypographyPageDescription.displayName = "TypographyPageDescription"
