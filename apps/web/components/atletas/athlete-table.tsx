"use client"

import * as React from "react"
import { MoreHorizontal, Mail, Phone, Calendar as CalendarIcon, User, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"

const MOCK_ATHLETES = [
  {
    id: "ATH-001",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+34 600 123 456",
    dni: "12345678A",
    status: "active",
    lastVisit: "2024-03-25",
    avatar: "https://i.pravatar.cc/150?u=juan",
  },
  {
    id: "ATH-002",
    firstName: "María",
    lastName: "Rosser",
    email: "m.rosser@box.com",
    phone: "+34 600 789 012",
    dni: "87654321B",
    status: "inactive",
    lastVisit: "2024-02-12",
    avatar: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "ATH-003",
    firstName: "Alfredo",
    lastName: "Curtis",
    email: "alfredo.c@gym.com",
    phone: "+34 600 345 678",
    dni: "45678901C",
    status: "pending",
    lastVisit: "2024-03-20",
    avatar: "https://i.pravatar.cc/150?u=alfredo",
  },
  {
    id: "ATH-004",
    firstName: "Giana",
    lastName: "Botosh",
    email: "giana.b@fitness.es",
    phone: "+34 600 901 234",
    dni: "23456789D",
    status: "active",
    lastVisit: "2024-03-27",
    avatar: "https://i.pravatar.cc/150?u=giana",
  },
]

function StatusBadge({ status }: { status: string }) {
  const configs = {
    active: { label: "Activo", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    inactive: { label: "Inactivo", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    pending: { label: "Pendiente", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  }
  const config = configs[status as keyof typeof configs] || configs.pending

  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit mx-auto",
      config.color
    )}>
      {config.label}
    </div>
  )
}

export function AthleteTable({ filter = "all" }: { filter?: string }) {
  const filteredAthletes = React.useMemo(() => {
    if (filter === "all") return MOCK_ATHLETES
    if (filter === "active") return MOCK_ATHLETES.filter(a => a.status === "active")
    if (filter === "debtors") return MOCK_ATHLETES.filter(a => a.status === "inactive") // currently "inactive" means debtor in this mock context
    if (filter === "expiring") return MOCK_ATHLETES.filter(a => a.status === "active") // mock constraint, pretend everyone active is expiring
    return MOCK_ATHLETES
  }, [filter])

  return (
    <ActionTableRoot>
      <ActionTable>
        <ActionTableHeader>
          <tr>
            <ActionTableHead className="w-12">
              <Checkbox className="rounded-md border-white/10 data-[state=checked]:bg-[#5e5ce6] data-[state=checked]:border-[#5e5ce6]" />
            </ActionTableHead>
            <ActionTableHead>Atleta / ID</ActionTableHead>
            <ActionTableHead className="hidden md:table-cell">Contacto</ActionTableHead>
            <ActionTableHead className="hidden lg:table-cell">Actividad</ActionTableHead>
            <ActionTableHead className="text-center">Estado</ActionTableHead>
            <ActionTableHead className="w-12 text-right">Acción</ActionTableHead>
          </tr>
        </ActionTableHeader>
        <ActionTableBody>
          <AnimatePresence mode="popLayout">
            {filteredAthletes.map((athlete, i) => (
              <motion.tr
                key={athlete.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors cursor-default"
              >
                <ActionTableCell>
                  <Checkbox className="rounded-md border-white/10 data-[state=checked]:bg-[#5e5ce6] data-[state=checked]:border-[#5e5ce6] transition-colors" />
                </ActionTableCell>
                <ActionTableCell>
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <Avatar className="size-11 rounded-2xl border-2 border-white/5 group-hover/avatar:border-[#5e5ce6]/40 transition-all overflow-hidden ring-1 ring-white/5">
                        <AvatarImage src={athlete.avatar} />
                        <AvatarFallback className="bg-zinc-800 text-[10px] font-black uppercase text-zinc-500">{athlete.firstName[0]}{athlete.lastName[0]}</AvatarFallback>
                      </Avatar>
                      {athlete.status === "active" && (
                        <span className="absolute -bottom-1 -right-1 size-3 bg-[#47e266] rounded-full border-2 border-[#0a0a0c] shadow-lg" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white tracking-tight text-sm group-hover:text-[#c2c1ff] transition-colors truncate">
                        {athlete.firstName} {athlete.lastName}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium tracking-tight flex items-center gap-1.5 pt-0.5">
                        {athlete.id} <span className="size-0.5 rounded-full bg-zinc-700" /> DNI: {athlete.dni}
                      </span>
                    </div>
                  </div>
                </ActionTableCell>
                <ActionTableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                      <Mail className="size-3 text-zinc-600" />
                      {athlete.email}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
                      <Phone className="size-3 text-zinc-600" />
                      {athlete.phone}
                    </div>
                  </div>
                </ActionTableCell>
                <ActionTableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest opacity-80">
                    <CalendarIcon className="size-3.5 text-[#5e5ce6]/40" />
                    {athlete.lastVisit}
                  </div>
                </ActionTableCell>
                <ActionTableCell className="text-center">
                  <StatusBadge status={athlete.status} />
                </ActionTableCell>
                <ActionTableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl size-8 hover:bg-white/10 text-zinc-500 hover:text-white transition-all">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-2xl border-white/5 bg-zinc-950/90 backdrop-blur-xl shadow-2xl p-2 min-w-[180px]">
                      <DropdownMenuLabel className="text-[11px] font-semibold tracking-wider text-zinc-500 px-3 py-2">Opciones</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem asChild className="rounded-xl focus:bg-indigo-500/10 focus:text-indigo-400 font-semibold text-xs px-3 py-2 gap-2 cursor-pointer transition-colors">
                        <Link href={`/dashboard/atletas/${athlete.id}`}>
                          <User className="size-3.5" />
                          Ver perfil
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-xl focus:bg-indigo-500/10 focus:text-indigo-400 font-semibold text-xs px-3 py-2 gap-2 cursor-pointer transition-colors">
                        <ExternalLink className="size-3.5" />
                        Generar pase
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem className="rounded-xl focus:bg-rose-500/10 focus:text-rose-400 font-semibold text-xs px-3 py-2 gap-2 cursor-pointer transition-colors text-rose-500">
                        Suspender atleta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ActionTableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </ActionTableBody>
      </ActionTable>
      <div className="p-6 border-t border-white/5 bg-white/1 flex items-center justify-between">
         <p className="text-[11px] font-semibold text-zinc-500 tracking-wider">Mostrando {filteredAthletes.length} atletas de un total de 1,248</p>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-2xl h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold disabled:opacity-30" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="rounded-2xl h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold">Siguiente</Button>
         </div>
      </div>
    </ActionTableRoot>
  )
}


