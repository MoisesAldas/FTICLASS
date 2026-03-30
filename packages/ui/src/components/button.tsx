import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@workspace/ui/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // --- FITCLASS custom (para marketing + app) ---
        "fitclass-primary":
          "bg-linear-to-br from-[#5e5ce6] to-[#4d4ad5] text-white rounded-2xl shadow-lg shadow-indigo-500/10 hover:bg-[#4d4ad5] transition-all font-bold",
        "fitclass-secondary":
          "bg-white/10 backdrop-blur-2xl border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all font-semibold",
        "fitclass-cta":
          "bg-white text-black rounded-2xl hover:bg-black hover:text-white shadow-2xl transition-all font-bold",
        "fitclass-dark":
          "bg-zinc-800 text-white rounded-2xl hover:bg-white hover:text-black transition-all font-semibold",
        "fitclass-elite":
          "bg-black text-white rounded-2xl hover:scale-105 transition-all font-bold",
        "fitclass-nav":
          "bg-white text-black rounded-2xl hover:bg-[#c2c1ff] transition-colors shrink-0 font-bold",
        "fitclass-ghost":
          "text-white font-semibold hover:text-[#c2c1ff] transition-colors",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-4 text-sm",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        // --- FITCLASS sizes ---
        "fitclass-hero": "px-12 py-5 text-xl h-auto",
        "fitclass-cta": "px-16 py-8 text-2xl h-auto",
        "fitclass-nav": "px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm h-auto",
        "fitclass-pricing": "w-full py-5 text-base h-auto",
        "fitclass-compact":
          "px-4 py-3 text-[11px] md:text-xs tracking-tight h-auto font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
