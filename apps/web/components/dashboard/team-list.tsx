"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const members = [
  {
    name: "Ana Ruiz",
    role: "Coach — clase 07:00 HIIT",
    status: "Completado",
    avatar: "https://i.pravatar.cc/150?u=fit1",
  },
  {
    name: "Marcos Díaz",
    role: "Atleta — ciclo fuerza 5×5",
    status: "En curso",
    avatar: "https://i.pravatar.cc/150?u=fit2",
  },
  {
    name: "Laura Méndez",
    role: "Recepción — check-ins tarde",
    status: "Pendiente",
    avatar: "https://i.pravatar.cc/150?u=fit3",
  },
  {
    name: "Iván Costa",
    role: "Coach — técnica halterofilia",
    status: "En curso",
    avatar: "https://i.pravatar.cc/150?u=fit4",
  },
]

const statusConfigs = {
  Completado: "bg-[#47e266]/10 text-[#47e266]",
  "En curso": "bg-[#5e5ce6]/15 text-[#c2c1ff]",
  Pendiente: "bg-rose-500/10 text-rose-400",
}

export function TeamList() {
  return (
    <div className="bg-zinc-900/90 border border-white/5 rounded-3xl p-6 md:p-8 h-full">
      <div className="flex justify-between items-center mb-6 gap-2">
        <h3 className="text-lg font-black text-white tracking-tight">Equipo y turnos</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-2xl border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-wide h-8 shrink-0"
        >
          <Plus className="size-3 mr-1.5" />
          Añadir
        </Button>
      </div>

      <div className="space-y-5">
        {members.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.07 }}
            className="flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="size-10 rounded-2xl border border-white/5 ring-2 ring-transparent group-hover:ring-[#5e5ce6]/25 transition-all duration-300 shrink-0">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="rounded-2xl text-[10px] font-black">
                  AR
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-[#c2c1ff] transition-colors truncate">
                  {member.name}
                </h4>
                <p className="text-[10px] text-zinc-500 font-medium leading-snug line-clamp-2">
                  {member.role}
                </p>
              </div>
            </div>

            <div
              className={cn(
                "px-2 py-1 rounded-lg text-[9px] font-black tracking-widest uppercase shrink-0",
                statusConfigs[member.status as keyof typeof statusConfigs]
              )}
            >
              {member.status}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
