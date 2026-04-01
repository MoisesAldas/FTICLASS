"use client"

import * as React from "react"
import { 
  Trophy, 
  Dumbbell, 
  ArrowUpRight, 
  Plus, 
  Search,
  ChevronRight,
  TrendingUp,
  History
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"

interface PRRecord {
  id: string
  name: string
  category: "lifting" | "benchmark" | "gymnastics"
  value: string
  date: string
  improved: boolean
}

const MOCK_RECORDS: PRRecord[] = [
  { id: "1", name: "Back Squat", category: "lifting", value: "145 kg", date: "12 Mar 2024", improved: true },
  { id: "2", name: "Deadlift", category: "lifting", value: "180 kg", date: "05 Feb 2024", improved: false },
  { id: "3", name: "Fran (WOD)", category: "benchmark", value: "3:45 min", date: "20 Ene 2024", improved: true },
  { id: "4", name: "Muscle Ups", category: "gymnastics", value: "12 Reps", date: "15 Mar 2024", improved: true },
  { id: "5", name: "Snatch", category: "lifting", value: "85 kg", date: "01 Mar 2024", improved: false },
]

export function AthleteRecords() {
  const [filter, setFilter] = React.useState<"all" | "lifting" | "benchmark" | "gymnastics">("all")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">Marcas Personales</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#5e5ce6]">Historial de Progreso</p>
        </div>
        <Button size="sm" className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-wider text-[10px] h-9 px-4 transition-all active:scale-95 shadow-2xl">
           <Plus className="size-3.5 mr-1.5" />
           Nuevo Récord
        </Button>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-sans">
        {(["all", "lifting", "benchmark", "gymnastics"] as const).map((cat) => (
          <Button
            key={cat}
            onClick={() => setFilter(cat)}
            variant="ghost"
            className={cn(
              "h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              filter === cat ? "bg-white/10 text-white border border-white/10" : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {cat === "all" ? "Todos" : cat}
          </Button>
        ))}
      </div>

      {/* Records List */}
      <div className="grid grid-cols-1 gap-2">
        {MOCK_RECORDS.filter(r => filter === "all" || r.category === filter).map((record, idx) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group flex items-center justify-between p-3 bg-zinc-950/40 border border-white/5 rounded-2xl hover:bg-white/4 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
                  {record.category === "lifting" ? <Dumbbell className="size-5" /> : record.category === "benchmark" ? <Trophy className="size-5" /> : <TrendingUp className="size-5" /> }
               </div>
               <div>
                  <h4 className="text-[13px] font-black text-white uppercase">{record.name}</h4>
                  <p className="text-[10px] font-medium text-zinc-500">{record.date}</p>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-lg font-black text-white italic tracking-tight">{record.value}</p>
                  {record.improved && (
                    <div className="flex items-center justify-end gap-1 text-[9px] font-black text-emerald-500 uppercase">
                       <ArrowUpRight className="size-2.5" />
                       Mejorado
                    </div>
                  )}
               </div>
               <ChevronRight className="size-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 group cursor-pointer hover:bg-indigo-500/10 transition-all">
         <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <TrendingUp className="size-5" />
         </div>
         <div className="flex-1">
            <h4 className="text-xs font-black text-white uppercase">Ver Gráficos de Evolución</h4>
            <p className="text-[10px] font-medium text-zinc-500">Analiza el progreso histórico de {MOCK_RECORDS.length} ejercicios.</p>
         </div>
      </div>
    </div>
  )
}
