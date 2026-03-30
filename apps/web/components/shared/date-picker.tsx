"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

interface DatePickerProps {
  date?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ date, onChange, placeholder = "Seleccionar fecha", className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "w-full h-11 justify-start text-left font-bold text-[13px] rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-white/10 transition-all",
            !date && "text-zinc-500",
            className
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 text-zinc-500" />
          {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/5 shadow-2xl rounded-2xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
          locale={es}
          className="rounded-2xl"
        />
      </PopoverContent>
    </Popover>
  )
}
