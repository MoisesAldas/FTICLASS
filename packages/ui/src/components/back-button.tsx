"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Slot } from "radix-ui"
import { cn } from "@workspace/ui/lib/utils"

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  variant?: "fixed" | "absolute" | "relative"
  asChild?: boolean
}

export function BackButton({ 
  label = "Volver", 
  className,
  variant = "fixed",
  asChild = false,
  children,
  ...props 
}: BackButtonProps) {
  const positionClass = cn(
    variant === "fixed" && "fixed top-6 left-6 z-50 md:top-10 md:left-10",
    variant === "absolute" && "absolute -top-12 left-0 z-50",
    variant === "relative" && "relative"
  )

  const Comp = asChild ? Slot.Root : "button"

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={positionClass}
    >
      <Comp
        className={cn(
          "flex items-center gap-2 h-10 px-4 rounded-full border border-white/10 bg-zinc-950/50 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all shadow-xl shadow-black/80 group active:scale-95 cursor-pointer",
          className
        )}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5 whitespace-nowrap">
              {label}
            </span>
          </>
        )}
      </Comp>
    </motion.div>
  )
}
