"use client"

import * as React from "react"
import { Edit2 } from "lucide-react"

import { AddServiceModal } from "@/components/services/add-service-modal"
import { Button } from "@workspace/ui/components/button"
import {
  ActionTable,
  ActionTableRoot,
  ActionTableHeader,
  ActionTableBody,
  ActionTableRow,
  ActionTableHead,
  ActionTableCell,
} from "@/components/shared/action-table"

export default function ServiciosPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Servicios</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Configure las disciplinas, reglas de reserva y accesos técnicos del Box.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddServiceModal />
        </div>
      </div>

      {/* 1. Listado Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Listado de Disciplinas</h2>
        </div>
        
        <ActionTableRoot>
          <ActionTable>
            <ActionTableHeader>
              <tr>
                <ActionTableHead>Nombre</ActionTableHead>
                <ActionTableHead>Estado</ActionTableHead>
                <ActionTableHead>Reservas</ActionTableHead>
                <ActionTableHead className="text-right">Acciones</ActionTableHead>
              </tr>
            </ActionTableHeader>
            <ActionTableBody>
              <ActionTableRow>
                <ActionTableCell className="text-[13px] font-bold text-white tracking-tight italic">FITCLASS / CROSSFIT</ActionTableCell>
                <ActionTableCell>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider">Activo</span>
                </ActionTableCell>
                <ActionTableCell className="text-[13px] font-semibold text-zinc-400">Automático</ActionTableCell>
                <ActionTableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="size-8 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>
                </ActionTableCell>
              </ActionTableRow>
            </ActionTableBody>
          </ActionTable>
        </ActionTableRoot>
      </section>

      {/* 2. Metrics Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Métricas de Gestión</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Servicios Activos</p>
            <p className="text-3xl font-bold text-white tracking-tight">12</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Reservas Hoy</p>
            <p className="text-3xl font-bold text-white tracking-tight">148</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Capacidad Box</p>
            <p className="text-3xl font-bold text-white tracking-tight">85%</p>
          </div>
        </div>
      </section>
    </div>
  )
}
