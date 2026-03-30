"use client"

import * as React from "react"
import { Search, Filter, SortAsc } from "lucide-react"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { AddAthleteModal } from "./add-athlete-modal"

export function AthleteToolbar() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      <div className="relative flex-1 group max-w-md w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none group-focus-within:text-[#5e5ce6] transition-colors" />
        <Input
          placeholder="Buscar atletas, DNI o email…"
          className="w-full bg-zinc-900/60 border-white/5 rounded-2xl pl-11 pr-14 h-12 text-sm focus-visible:ring-[#5e5ce6]/35 font-medium placeholder:text-zinc-600"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-lg border border-white/10 bg-zinc-900/80 text-[11px] text-zinc-500 font-bold tracking-tight">
          <span className="opacity-70 text-[10px]">⌘</span>
          <span>D</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
        <Button
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12 px-6 font-semibold flex items-center gap-2"
        >
          <Filter className="size-4 opacity-70" />
          Filtrar
        </Button>
        <Button
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12 px-6 font-semibold flex items-center gap-2"
        >
          <SortAsc className="size-4 opacity-70" />
          Ordenar
        </Button>
      </div>

      <div className="md:ml-auto">
        <AddAthleteModal />
      </div>
    </div>
  )
}
