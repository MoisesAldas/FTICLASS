"use client"

import * as React from "react"
import { Clock, Search, Filter, Edit2, Trash2, Plus } from "lucide-react"
import { ActionButton } from "@/components/shared/action-button"
import { AddScheduleModal } from "@/components/horarios/add-schedule-modal"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableRow, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

const MOCK_HORARIOS = [
  { id: 1, dia: "Lunes", descripcion: "Turno Mañana - CrossFit", inicio: "07:00", fin: "08:00", capacidad: 20 },
  { id: 2, dia: "Lunes", descripcion: "Turno Mañana - HIIT", inicio: "08:00", fin: "09:00", capacidad: 15 },
  { id: 3, dia: "Martes", descripcion: "CrossFit Avanzado", inicio: "18:00", fin: "19:00", capacidad: 25 },
  { id: 4, dia: "Miércoles", descripcion: "Levantamiento Olímpico", inicio: "19:00", fin: "20:30", capacidad: 10 },
]

export default function HorariosPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Horarios</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Gestione los turnos operativos y la capacidad máxima por sesión.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddScheduleModal />
        </div>
      </div>

      {/* Toolbar de Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por descripción o servicio..." 
            className="rounded-2xl bg-zinc-900/40 border-white/5 h-11 pl-10 focus:border-indigo-500/50 transition-all font-medium"
          />
        </div>
        <Button variant="ghost" className="rounded-2xl border border-white/5 bg-zinc-900/20 text-zinc-400 h-11 px-4 hover:text-white">
          <Filter className="mr-2 size-4" />
          Consultar
        </Button>
      </div>

      {/* 1. Listado Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Turnos y Capacidad</h2>
        </div>
        
        <ActionTableRoot>
          <ActionTable>
            <ActionTableHeader>
              <tr>
                <ActionTableHead>Día</ActionTableHead>
                <ActionTableHead>Descripción</ActionTableHead>
                <ActionTableHead>Horario</ActionTableHead>
                <ActionTableHead className="text-center">Capacidad</ActionTableHead>
                <ActionTableHead className="text-right">Acciones</ActionTableHead>
              </tr>
            </ActionTableHeader>
            <ActionTableBody>
              {MOCK_HORARIOS.map((item) => (
                <ActionTableRow key={item.id}>
                  <ActionTableCell className="text-[13px] font-bold text-white">{item.dia}</ActionTableCell>
                  <ActionTableCell className="text-[13px] font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {item.descripcion}
                  </ActionTableCell>
                  <ActionTableCell>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-black font-mono">
                      {item.inicio} - {item.fin}
                    </span>
                  </ActionTableCell>
                  <ActionTableCell className="text-[13px] font-bold text-white text-center">
                    {item.capacidad}
                  </ActionTableCell>
                  <ActionTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 transition-all">
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-red-500/70">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </ActionTableCell>
                </ActionTableRow>
              ))}
            </ActionTableBody>
          </ActionTable>
        </ActionTableRoot>
      </section>

      {/* 2. KPIs Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Resumen Operativo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Turnos AM</p>
            <p className="text-3xl font-bold text-white tracking-tight">8</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Turnos PM</p>
            <p className="text-3xl font-bold text-white tracking-tight">12</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Cupos Totales</p>
            <p className="text-3xl font-bold text-white tracking-tight">450</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Disponibilidad</p>
            <p className="text-3xl font-bold text-white tracking-tight">Varios</p>
          </div>
        </div>
      </section>
    </div>
  )
}
