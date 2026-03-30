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
  ...props 
}: ActionButtonProps) {
  return (
    <Button
      variant="fitclass-primary"
      className={cn(
        "rounded-2xl h-12 px-6 bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white font-bold text-sm transition-all active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {icon}
      {label}
    </Button>
  )
}
