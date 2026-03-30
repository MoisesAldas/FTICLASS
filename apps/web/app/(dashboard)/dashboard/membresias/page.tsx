"use client"

import * as React from "react"
import { LayoutGrid, AlertTriangle } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { DatePicker } from "@/components/shared/date-picker"
import { SelectPrimitive } from "@/components/shared/select-primitive"

export default function MembresiasPage() {
  const [freezeDate, setFreezeDate] = React.useState<Date>(new Date("2026-03-30"))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Membresías</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Control maestro de estados: Congelación masiva y reactivación de acceso.
          </p>
        </div>
      </div>

      {/* 1. Control Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Control Maestro de Estados</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card: Congelar Membresías */}
          <section className="rounded-[40px] bg-zinc-950 border border-white/5 p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                 <h2 className="text-xl font-bold tracking-tight">Congelación Masiva</h2>
              </div>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                Se congelarán todas las membresías activas del servicio seleccionado a partir de la fecha indicada.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Servicio</label>
                    <SelectPrimitive 
                      options={[
                        { label: "CrossFit", value: "crossfit" },
                        { label: "HIIT", value: "hiit" }
                      ]}
                      placeholder="Seleccionar servicio"
                      icon={LayoutGrid}
                      onValueChange={() => {}}
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Fecha Inicio</label>
                    <DatePicker date={freezeDate} onChange={(date) => date && setFreezeDate(date)} />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Congelar hasta</label>
                 <Input 
                  placeholder="Indefinido o fecha específica" 
                  className="rounded-2xl bg-zinc-900/50 border-white/5 h-11 px-4 transition-all focus:border-indigo-500/50 font-medium"
                 />
              </div>

              <Button className="w-full rounded-2xl h-12 bg-white text-black font-black text-[13px] uppercase tracking-wider hover:bg-zinc-200 transition-all mt-2">
                 Ejecutar Congelación
              </Button>
            </div>
          </section>

          {/* Card: Descongelar Membresías */}
          <section className="rounded-[40px] bg-zinc-950 border border-white/5 p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                 
                 <h2 className="text-xl font-bold tracking-tight">Reactivación Masiva</h2>
              </div>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-sm">
                Se descongelarán todas las membresías pausadas del servicio seleccionado para restaurar el acceso.
              </p>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Servicio</label>
                  <SelectPrimitive 
                    options={[
                      { label: "CrossFit", value: "crossfit" },
                      { label: "HIIT", value: "hiit" }
                    ]}
                    placeholder="Seleccionar servicio"
                    icon={LayoutGrid}
                    onValueChange={() => {}}
                  />
               </div>

              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                 <AlertTriangle className="size-5 text-indigo-400 shrink-0 mt-0.5" />
                 <p className="text-[11px] text-indigo-400/80 font-medium leading-relaxed">
                   Esta acción restaurará el consumo de días de membresía para todos los atletas vinculados a esta disciplina inmediatamente.
                 </p>
              </div>

              <div className="flex-1" />

              <Button className="w-full rounded-full h-12 bg-[#5e5ce6] text-white font-black text-[13px] uppercase tracking-wider hover:bg-[#4d4ad5] transition-all">
                 Confirmar Reactivación
              </Button>
            </div>
          </section>
        </div>
      </section>

      {/* 2. Metrics Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Métricas de Pausa</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Membresías Congeladas</p>
            <p className="text-3xl font-bold text-white tracking-tight">45</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Ahorro Promedio (Días)</p>
            <p className="text-3xl font-bold text-white tracking-tight">12.5</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Solicitudes Pendientes</p>
            <p className="text-3xl font-bold text-white tracking-tight">3</p>
          </div>
        </div>
      </section>
    </div>
  )
}
