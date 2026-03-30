"use client"

import * as React from "react"
import { Check, ChevronDown, LucideIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

interface Option {
  label: string
  value: string
}

interface SelectPrimitiveProps {
  options: Option[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  icon?: LucideIcon
  className?: string
}

export function SelectPrimitive({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  icon: Icon,
  className,
}: SelectPrimitiveProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-2xl bg-zinc-900/50 border-white/5 h-11 px-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-all",
            selectedOption && "text-white font-bold",
            className
          )}
        >
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className={cn("size-4", selectedOption ? "text-indigo-400" : "text-zinc-500")} />}
            <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          </div>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-1 bg-zinc-950 border-white/10 rounded-[20px] shadow-2xl z-50 max-h-[280px] overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onValueChange?.(option.value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 text-sm rounded-xl transition-all text-left",
                value === option.value
                  ? "bg-indigo-500/10 text-indigo-400 font-bold"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="size-4" />}
            </button>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-zinc-600 font-medium italic">
              No hay opciones disponibles
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
