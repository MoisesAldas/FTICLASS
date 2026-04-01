"use client"

import * as React from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode
  label: string
}

export function ActionButton({ 
  icon = <PlusCircle className="mr-2 size-4" />, 
  label, 
  className, 
  variant = "fitclass-primary",
  ...props 
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        "rounded-2xl h-12 px-6 font-bold text-sm transition-all active:scale-[0.98]",
        variant === "fitclass-primary" && "bg-indigo-600 hover:bg-indigo-500 text-white shadow-none",
        className
      )}
      {...props}
    >
      {icon}
      {label}
    </Button>
  )
}
