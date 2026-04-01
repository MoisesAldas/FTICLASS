"use client"

import * as React from "react"
import { CalendarDays, Filter, Plus, Users, Clock, LayoutGrid, CheckCircle2, Award, Flame } from "lucide-react"
import { ActionButton } from "@/components/shared/action-button"
import { AddClassModal } from "@/components/clases/add-class-modal"
import { DatePicker } from "@/components/shared/date-picker"
import { SelectPrimitive } from "@/components/shared/select-primitive"
import { ActionCard, ActionCardHeader, ActionCardContent, ActionCardFooter, ActionCardAvatar, ActionCardTags, ActionCardProgress } from "@/components/shared/action-card"
import { format, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { AttendanceModal } from "@/components/clases/attendance-modal"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"

const MOCK_CLASES = [
  { id: 1, servicio: "CrossFit", fecha: "2026-03-29", horario: "14:00 - 18:00", inscritos: 0, capacidad: 30, coach: "Martín Gómez", wod: "Murph" },
  { id: 2, servicio: "HIIT", fecha: "2026-03-29", horario: "10:00 - 11:00", inscritos: 12, capacidad: 20, coach: "Sofía López", wod: "Fran (Benchmark)" },
  { id: 3, servicio: "CrossFit", fecha: "2026-03-29", horario: "19:00 - 20:00", inscritos: 28, capacidad: 30, coach: "Martín Gómez", wod: "Fuerza Absoluta" },
]

export default function ClasesPage() {
  const [allowBooking, setAllowBooking] = React.useState(true)
  const TODAY = new Date("2026-03-30") // Mocking today as March 30
  const [startDate, setStartDate] = React.useState<Date>(TODAY)
  const [endDate, setEndDate] = React.useState<Date>(TODAY)
  const [selectedClass, setSelectedClass] = React.useState<any>(null)
  const [isAttendanceOpen, setIsAttendanceOpen] = React.useState(false)

  const isTodayView = React.useMemo(() => isSameDay(startDate, TODAY) && isSameDay(endDate, TODAY), [startDate, endDate, TODAY])

  const handleOpenAttendance = (clase: any) => {
    setSelectedClass({
      id: clase.id.toString(),
      name: clase.servicio,
      hour: clase.horario.split(" - ")[0],
      coach: clase.coach,
      capacity: clase.capacidad
    })
    setIsAttendanceOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Clases y Reservas</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Configure la disponibilidad de sesiones y monitoree la asistencia en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddClassModal />
        </div>
      </div>

      {/* 1. Configuration Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Configuración y Disponibilidad</h2>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 rounded-[32px] bg-zinc-950 border border-white/5 p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
             <div className="flex items-center gap-4 flex-1 w-full">
                <div className="flex flex-col gap-1.5 flex-1">
                   <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-1">Servicio</label>
                   <SelectPrimitive 
                      options={[
                        { label: "CrossFit", value: "crossfit" },
                        { label: "HIIT", value: "hiit" }
                      ]}
                      value="crossfit"
                      onValueChange={() => {}}
                      icon={LayoutGrid}
                   />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                   <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-1">Desde</label>
                   <DatePicker date={startDate} onChange={(date) => date && setStartDate(date)} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                   <label className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-1">Hasta</label>
                   <DatePicker date={endDate} onChange={(date) => date && setEndDate(date)} />
                </div>
             </div>
             <Button variant="ghost" className="rounded-full h-11 px-8 font-black text-xs uppercase tracking-widest border border-white/10 text-zinc-300 hover:bg-white/5 transition-all">
                Consultar
             </Button>
          </div>

          <div className="rounded-[32px] bg-indigo-500/5 border border-indigo-500/10 p-6 flex items-center justify-between shadow-xl">
             <div className="space-y-1">
                <p className="text-white font-bold text-sm">Habilitar Reservas</p>
                <p className="text-indigo-400/70 text-[11px] font-medium leading-none">Abre el acceso al box para clientes</p>
             </div>
             <Switch checked={allowBooking} onCheckedChange={setAllowBooking} />
          </div>
        </div>
      </section>

      {/* 2. Listado Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex flex-col gap-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Sesiones Consultadas</h2>
              {isTodayView && (
                 <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest w-fit border border-emerald-500/20">
                    <div className="size-1 rounded-full bg-emerald-500 animate-pulse" /> Panel de hoy
                 </span>
              )}
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_CLASES.map((clase) => (
             <ActionCard 
               key={clase.id}
               decoratorIcon={<CheckCircle2 className="size-20 opacity-50" />}
             >
                <ActionCardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                     <ActionCardAvatar>
                        <CalendarDays className="size-5 text-zinc-400" />
                     </ActionCardAvatar>
                     <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                           <h3 className="text-2xl font-black text-white tracking-tighter">{clase.horario}</h3>
                           <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{clase.fecha}</span>
                        </div>
                        <ActionCardTags>
                           <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 inline-flex items-center gap-1.5">
                             {clase.servicio}
                           </span>
                        </ActionCardTags>
                     </div>
                  </div>
                </ActionCardHeader>
                
                <ActionCardContent className="pt-0">
                  <div className="space-y-5">
                     {/* Assigned Relational Data - Structured like job offer chips */}
                     <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#131315]/80 p-3 rounded-2xl border border-white/5 space-y-1">
                           <div className="flex items-center gap-1.5 text-zinc-500">
                              <Award className="size-3" />
                              <span className="text-[9px] uppercase font-black tracking-widest">Coach</span>
                           </div>
                           <p className="text-[13px] font-bold text-white truncate">{clase.coach}</p>
                        </div>
                        <div className="bg-[#131315]/80 p-3 rounded-2xl border border-white/5 space-y-1">
                           <div className="flex items-center gap-1.5 text-zinc-500">
                              <Flame className="size-3" />
                              <span className="text-[9px] uppercase font-black tracking-widest">WOD</span>
                           </div>
                           <p className="text-[13px] font-bold text-white truncate">{clase.wod}</p>
                        </div>
                     </div>

                     {/* Progress Metric */}
                     <div className="pt-2 border-t border-white/5">
                        <ActionCardProgress 
                           value={clase.inscritos} 
                           max={clase.capacidad} 
                           label="Ocupación" 
                        />
                     </div>
                  </div>
                </ActionCardContent>

                <ActionCardFooter 
                  onEdit={() => console.log('Edit class', clase.id)}
                  onDelete={() => console.log('Delete class', clase.id)}
                  className="pt-0"
                >
                   <ActionButton 
                     label="Gestionar Asistencia" 
                     icon={<Users className="size-4 mr-2" />}
                     className="w-full h-11 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 text-white font-black uppercase tracking-wider text-[10px]"
                     onClick={() => handleOpenAttendance(clase)}
                   />
                </ActionCardFooter>
             </ActionCard>
           ))}
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.03em] text-zinc-500 px-1">Ocupación Promedio</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Mini metrics cards */}
           {[
             { label: "Check-ins AM", value: "84" },
             { label: "Check-ins PM", value: "156" },
             { label: "Canceleaciones", value: "12" },
             { label: "Waitlist", value: "8" }
           ].map((stat, i) => (
             <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{stat.label}</span>
                <span className="text-xl font-bold text-white tracking-tighter">{stat.value}</span>
             </div>
           ))}
        </div>
      </section>

      <AttendanceModal 
        isOpen={isAttendanceOpen} 
        onOpenChange={setIsAttendanceOpen} 
        classData={selectedClass || { id: "", name: "", hour: "", coach: "", capacity: 0 }}
      />
    </div>
  )
}

