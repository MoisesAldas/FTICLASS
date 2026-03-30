"use client"

import * as React from "react"
import { Video, Calendar, Clock, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"

const reminders = [
  {
    title: "WOD + técnica — Snatch",
    time: "18:00 – 19:30",
    icon: Video,
    active: true,
  },
  {
    title: "Revisión de RM (squat)",
    time: "Mañana · 10:00 – 11:00",
    icon: Calendar,
    active: false,
  },
]

export function RemindersCard() {
  return (
    <div className="bg-zinc-900/90 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-white tracking-tight">Recordatorios</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-2xl border border-white/10 text-zinc-400 hover:text-white"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="space-y-6 flex-1">
        {reminders.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="group cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-[#5e5ce6]/20 transition-colors duration-300">
                <item.icon className="size-5 text-[#c2c1ff]" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-[#c2c1ff] transition-colors leading-snug">
                  {item.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
                  <Clock className="size-3 shrink-0" />
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            {item.active && (
              <Button className="mt-5 w-full h-12 bg-linear-to-br from-[#5e5ce6] to-[#4d4ad5] hover:opacity-95 text-white rounded-2xl flex items-center justify-center gap-2 ring-1 ring-white/15 font-black uppercase text-xs tracking-wide">
                <Video className="size-4" />
                Abrir vista clase
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
