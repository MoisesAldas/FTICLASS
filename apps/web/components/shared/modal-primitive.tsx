"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

interface ModalPrimitiveProps {
  trigger: React.ReactNode
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  maxWidth?: string
  className?: string
}

export function ModalPrimitive({
  trigger,
  title,
  description,
  icon: Icon,
  children,
  open,
  onOpenChange,
  maxWidth = "sm:max-w-[720px]",
  className,
}: ModalPrimitiveProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className={cn(
          maxWidth,
          "rounded-[32px] bg-zinc-950 border-white/5 shadow-2xl p-8 backdrop-blur-3xl focus:outline-none",
          className
        )}
      >
        <DialogHeader className="gap-2 text-left border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-3">
             {Icon && <Icon className="size-6 text-indigo-500" />}
             <DialogTitle className="text-3xl font-black tracking-tight text-white uppercase">
               {title}
             </DialogTitle>
          </div>
          {description && (
            <DialogDescription className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xl">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
