"use client"

import * as React from "react"
import { Search, Filter, Edit2, Trash2, Award } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { AddStaffModal } from "@/components/staff/add-staff-modal"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableRow, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"

const MOCK_STAFF = [
  { id: 1, nombre: "Martín", apellidos: "Gómez", rol: "Head Coach", especialidad: "CrossFit Core", email: "martin@fitclass.com", telefono: "+1 555-0100" },
  { id: 2, nombre: "Sofía", apellidos: "López", rol: "Coach Nivel 2", especialidad: "Halterofilia", email: "sofia@fitclass.com", telefono: "+1 555-0101" },
  { id: 3, nombre: "Andrés", apellidos: "Ruiz", rol: "Coach Auxiliar", especialidad: "Gimnasia", email: "andres@fitclass.com", telefono: "+1 555-0102" },
]

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Staff Operativo</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Directorio de coaches y entrenadores disponibles para asignación de clases y horarios.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddStaffModal />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por nombre, especialidad o correo..." 
            className="rounded-2xl bg-zinc-900/40 border-white/5 h-11 pl-10 focus:border-indigo-500/50 transition-all font-medium text-white"
          />
        </div>
        <Button variant="ghost" className="rounded-2xl border border-white/5 bg-zinc-900/20 text-zinc-400 h-11 px-4 hover:text-white transition-colors">
          <Filter className="mr-2 size-4" />
          Filtros
        </Button>
      </div>

      {/* Staff List Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Coaches Registrados</h2>
        </div>
        
        <ActionTableRoot>
          <ActionTable>
            <ActionTableHeader>
              <tr>
                <ActionTableHead>Coach</ActionTableHead>
                <ActionTableHead>Contacto</ActionTableHead>
                <ActionTableHead>Rol & Especialidad</ActionTableHead>
                <ActionTableHead className="text-right">Acciones</ActionTableHead>
              </tr>
            </ActionTableHeader>
            <ActionTableBody>
              {MOCK_STAFF.map((coach) => (
                <ActionTableRow key={coach.id}>
                  <ActionTableCell>
                    <div className="flex flex-col">
                       <span className="text-[14px] font-bold text-white">{coach.nombre} {coach.apellidos}</span>
                    </div>
                  </ActionTableCell>
                  <ActionTableCell>
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[13px] font-medium text-zinc-300">{coach.email}</span>
                       <span className="text-[11px] font-medium text-zinc-500">{coach.telefono}</span>
                     </div>
                  </ActionTableCell>
                  <ActionTableCell>
                    <div className="flex flex-col items-start gap-1">
                       <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-indigo-500/20">
                          <Award className="size-3" />
                          {coach.rol}
                       </span>
                       <span className="text-[12px] font-semibold text-zinc-400 pl-1">{coach.especialidad}</span>
                    </div>
                  </ActionTableCell>
                  <ActionTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 text-zinc-400 transition-all">
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-red-500/10 hover:text-red-400/90 text-red-500/50 transition-all">
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

      {/* Metrics Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Distribución del Equipo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Total Staff</p>
            <p className="text-3xl font-bold text-white tracking-tight">3</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Especialidades</p>
            <p className="text-3xl font-bold text-white tracking-tight">3</p>
          </div>
        </div>
      </section>
    </div>
  )
}
