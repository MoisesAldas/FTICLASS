"use client"

import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface ViewToggleProps {
  view: 'calendar' | 'agenda'
  onViewChange: (view: 'calendar' | 'agenda') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex p-1 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
      <button
        onClick={() => onViewChange('calendar')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          view === 'calendar' 
            ? "bg-white text-black shadow-lg shadow-white/10" 
            : "text-zinc-500 hover:text-white"
        )}
      >
        <LayoutGrid className="size-3.5" />
        <span className="hidden sm:inline">Calendario</span>
      </button>
      
      <button
        onClick={() => onViewChange('agenda')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          view === 'agenda' 
            ? "bg-white text-black shadow-lg shadow-white/10" 
            : "text-zinc-500 hover:text-white"
        )}
      >
        <List className="size-3.5" />
        <span className="hidden sm:inline">Agenda</span>
      </button>
    </div>
  )
}
