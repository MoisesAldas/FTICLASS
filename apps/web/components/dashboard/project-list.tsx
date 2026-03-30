"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Plus,
  ClipboardList,
  UserPlus,
  CalendarClock,
  CreditCard,
  BarChart3,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const tasks = [
  {
    name: "Renovar membresía — López",
    date: "28 mar 2026",
    icon: CreditCard,
    color: "text-[#c2c1ff]",
  },
  {
    name: "Alta nuevo atleta (prueba gratis)",
    date: "28 mar 2026",
    icon: UserPlus,
    color: "text-[#c2c1ff]",
  },
  {
    name: "Ajustar plantilla WOD viernes",
    date: "29 mar 2026",
    icon: ClipboardList,
    color: "text-[#ffc07a]",
  },
  {
    name: "Bloquear cupos clase 19:00",
    date: "30 mar 2026",
    icon: CalendarClock,
    color: "text-[#c2c1ff]",
  },
  {
    name: "Exportar informe de asistencia",
    date: "1 abr 2026",
    icon: BarChart3,
    color: "text-[#47e266]",
  },
]

export function ProjectList() {
  return (
    <div className="bg-zinc-900/90 border border-white/5 rounded-3xl p-6 md:p-8 h-full">
      <div className="flex justify-between items-center mb-6 gap-2">
        <h3 className="text-lg font-black text-white tracking-tight">Pendientes</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/10 hover:bg-white/5 text-[10px] h-8 px-3 font-black uppercase tracking-wide shrink-0"
        >
          <Plus className="size-3 mr-1.5" />
          Nuevo
        </Button>
      </div>

      <div className="space-y-5">
        {tasks.map((task, i) => (
          <motion.div
            key={task.name}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="flex items-start gap-3 group cursor-pointer"
          >
            <div className="size-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-white/5 transition-colors duration-300 shrink-0">
              <task.icon className={task.color} />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-sm font-semibold text-white group-hover:text-[#c2c1ff] transition-colors leading-snug">
                {task.name}
              </h4>
              <p className="text-[10px] text-zinc-500 font-medium">Vence: {task.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
