"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { AthleteKpis } from "@/components/atletas/athlete-kpis"
import { AthleteToolbar } from "@/components/atletas/athlete-toolbar"
import { AthleteTable } from "@/components/atletas/athlete-table"
import { cn } from "@workspace/ui/lib/utils"

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Activos" },
  { id: "debtors", label: "Morosos" },
  { id: "expiring", label: "Próximos a vencer" },
]

export default function AtletasPage() {
  const [activeFilter, setActiveFilter] = React.useState("all")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Atletas</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Administración centralizada de miembros, membresías y estados de salud en Fitclass.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AthleteToolbar />
        </div>
      </div>

      {/* 2. Table: El listado principal */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Listado de Miembros</h2>
           
           {/* Quick Filters */}
           <div className="inline-flex items-center p-1 bg-[#131315] border border-white/5 rounded-2xl w-full sm:w-auto overflow-x-auto shadow-inner">
              {FILTERS.map((filter) => (
                 <button
                   key={filter.id}
                   onClick={() => setActiveFilter(filter.id)}
                   className={cn(
                      "px-4 h-9 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                      activeFilter === filter.id 
                         ? "bg-[#5e5ce6] text-white shadow-md shadow-indigo-500/20" 
                         : "text-zinc-500 hover:text-white hover:bg-white/5"
                   )}
                 >
                   {filter.label}
                 </button>
              ))}
           </div>
        </div>
        <AthleteTable filter={activeFilter} />
      </section>

      {/* 3. KPIs: Indicadores de rendimiento al final según lo solicitado */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Indicadores de Rendimiento (KPIs)</h2>
        </div>
        <AthleteKpis />
      </section>
    </div>
  )
}
