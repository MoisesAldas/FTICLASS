"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, Phone, Calendar as CalendarIcon, Edit2, ShieldCheck } from "lucide-react"

import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { ActionButton } from "@/components/shared/action-button"
import { cn } from "@workspace/ui/lib/utils"

interface AthleteHeaderProps {
  athlete: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    dni: string
    status: string
    memberSince: string
    avatar: string
  }
}

export function AthleteHeader({ athlete }: AthleteHeaderProps) {
  const isSuspended = athlete.status === "suspended"

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 md:p-8 rounded-[32px] bg-[#131315] border border-white/5 shadow-2xl relative overflow-hidden">
      {/* Decorator Graphic */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none text-white">
        <ShieldCheck className="w-96 h-96" />
      </div>

      {/* Avatar Section */}
      <div className="relative group shrink-0">
        <Avatar className="size-24 rounded-3xl border-2 border-white/10 group-hover:border-[#5e5ce6]/40 transition-all shadow-xl ring-1 ring-white/5">
          <AvatarImage src={athlete.avatar} />
          <AvatarFallback className="bg-zinc-900 text-2xl font-black uppercase text-zinc-600">
            {athlete.firstName[0]}{athlete.lastName[0]}
          </AvatarFallback>
        </Avatar>
        {athlete.status === "active" && (
          <span className="absolute -bottom-2 -right-2 size-6 bg-[#47e266] rounded-full border-[3px] border-[#131315] shadow-lg flex items-center justify-center" />
        )}
      </div>

      {/* Main Info */}
      <div className="flex flex-col gap-2 flex-1 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {athlete.firstName} {athlete.lastName}
          </h1>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            athlete.status === "active" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
            athlete.status === "inactive" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" :
            "text-amber-400 bg-amber-500/10 border-amber-500/20"
          )}>
            {athlete.status === "active" ? "Activo" : athlete.status === "inactive" ? "Inactivo" : "Pendiente"}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5"><Mail className="size-4 text-zinc-600" /> {athlete.email}</span>
          <span className="flex items-center gap-1.5"><Phone className="size-4 text-zinc-600" /> {athlete.phone}</span>
          <span className="flex items-center gap-1.5"><CalendarIcon className="size-4 text-zinc-600" /> Miembro desde {athlete.memberSince}</span>
        </div>
        
        <div className="text-xs text-zinc-600 font-semibold uppercase tracking-widest mt-1">
          ID: {athlete.id} • DNI: {athlete.dni}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto z-10 w-full md:w-auto">
        <Button 
          variant="ghost" 
          className="flex-1 md:flex-none h-12 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <Edit2 className="size-4 mr-2" />
          Editar Perfil
        </Button>
      </div>
    </div>
  )
}
