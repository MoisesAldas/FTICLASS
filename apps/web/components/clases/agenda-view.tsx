"use client"

import * as React from "react"
import { 
  Users, 
  Clock, 
  Award, 
  ChevronRight, 
  LayoutGrid,
  CalendarDays,
  Sparkles,
  Flame
} from "lucide-react"
import { format, isToday, isTomorrow, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { formatTimeTo12h } from "@/lib/format"

interface AgendaViewProps {
  sessions: any[]
  wods?: any[]
  onSessionSelect: (session: any) => void
}

export function AgendaView({ sessions, wods = [], onSessionSelect }: AgendaViewProps) {
  // Agrupar sesiones por fecha
  const groupedSessions = sessions.reduce((acc: any, sess) => {
    const date = sess.date
    if (!acc[date]) acc[date] = []
    acc[date].push(sess)
    return acc
  }, {})

  const sortedDates = Object.keys(groupedSessions).sort()

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-950/20 rounded-[2.5rem] border border-dashed border-white/5">
        <CalendarDays className="size-12 text-zinc-800 mb-4" />
        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Sin Programación</h3>
        <p className="text-zinc-600 text-sm font-medium">No hay clases que coincidan con tus filtros.</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {sortedDates.map((dateStr) => {
        const date = parseISO(dateStr)
        const daySessions = groupedSessions[dateStr]
        const isTodayDate = isToday(date)
        const isTomorrowDate = isTomorrow(date)

        return (
          <div key={dateStr} className="relative pl-10 md:pl-24">
            {/* LÍNEA DE TIEMPO LATERAL */}
            <div className="absolute left-0 top-0 h-full w-px bg-linear-to-b from-indigo-500/50 via-zinc-900 to-transparent flex flex-col items-center">
               <div className={cn(
                 "size-3 rounded-full border-2 border-zinc-950 mb-4",
                 isTodayDate ? "bg-indigo-500 shadow-lg shadow-indigo-500/50 scale-125" : "bg-zinc-700"
               )} />
            </div>

            {/* CABECERA DE DÍA */}
            <div className="mb-6 flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                 {isTodayDate && (
                    <Badge className="bg-indigo-500 text-white border-none px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest leading-none">Hoy</Badge>
                 )}
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
                    {format(date, 'EEEE', { locale: es })}
                 </span>
              </div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                 {format(date, "d 'de' MMMM", { locale: es })}
              </h3>
            </div>

            {/* LISTA DE SESIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {daySessions.map((sess: any) => {
                  // --- Lógica de extracción de WOD ---
                  let sessionWod = null
                  if (sess.notes?.startsWith('WOD: ')) {
                    const wodId = sess.notes.replace('WOD: ', '').trim()
                    sessionWod = wods.find(w => w.id === wodId)
                  }
                  if (!sessionWod) {
                    sessionWod = wods.find(w => w.date === sess.date)
                  }

                  const enrolled = sess.current_enrolled || 0
                  const capacity = sess.max_capacity || 20
                  const progress = Math.min((enrolled / capacity) * 100, 100)

                  return (
                    <div 
                      key={sess.id}
                      className="group flex flex-col p-5 bg-zinc-950/40 rounded-3xl border border-white/5 hover:border-indigo-500/20 hover:bg-zinc-900/60 transition-all gap-4 relative overflow-hidden shadow-lg backdrop-blur-sm"
                    >
                      {/* Header: TIME & DATE */}
                      <div className="flex items-start justify-between">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2.5">
                               <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 opacity-70">
                                  <CalendarDays className="size-4 text-white/50" />
                               </div>
                               <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">
                                 {formatTimeTo12h(sess.start_time)} - {formatTimeTo12h(sess.end_time)}
                               </h4>
                            </div>
                            <Badge className="w-fit bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest leading-none">
                               {sess.class_type?.name}
                            </Badge>
                         </div>
                         <span className="text-[9px] font-bold text-zinc-700 tracking-widest font-mono">
                            {sess.date}
                         </span>
                      </div>

                      {/* Content: COACH & WOD CARDS */}
                      <div className="grid grid-cols-2 gap-3">
                         {/* COACH CARD */}
                         <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 opacity-40">
                               <Award className="size-2.5 text-zinc-400" />
                               <span className="text-[8px] font-black uppercase tracking-widest leading-none">Coach</span>
                            </div>
                            <span className="text-[11px] font-bold text-white truncate">
                               {(() => {
                                 const p = Array.isArray(sess.coach?.profiles) ? sess.coach.profiles[0] : sess.coach?.profiles;
                                 return p?.full_name || 'Staff'
                               })()}
                            </span>
                         </div>

                         {/* WOD CARD */}
                         <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-white/5 flex flex-col gap-1.5 relative overflow-hidden">
                            <div className="flex items-center gap-1.5 opacity-40">
                               <Flame className="size-2.5 text-zinc-400" />
                               <span className="text-[8px] font-black uppercase tracking-widest leading-none">WOD</span>
                            </div>
                            <span className="text-[11px] font-bold text-white truncate">
                               {sessionWod?.title || 'Técnica/Open'}
                            </span>
                            {sessionWod && (
                               <Flame className="absolute -right-1 -bottom-1 size-8 text-indigo-500/10 -rotate-12 opacity-50" />
                            )}
                         </div>
                      </div>

                      {/* OCUPACIÓN & PROGRESS BAR */}
                      <div className="space-y-2.5 px-0.5">
                         <div className="flex items-center justify-between">
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Ocupación</span>
                            <span className="text-[10px] font-black text-white italic leading-none">
                               {enrolled} <span className="text-zinc-700">/ {capacity}</span>
                            </span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                              className={cn(
                                "h-full transition-all duration-1000 ease-out rounded-full",
                                progress >= 100 ? "bg-red-500" : progress >= 80 ? "bg-amber-500" : "bg-indigo-500"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                         </div>
                      </div>

                      {/* ACTION BUTTON */}
                      <Button 
                        onClick={() => onSessionSelect({
                          id: sess.id,
                          name: sess.class_type?.name,
                          hour: `${formatTimeTo12h(sess.start_time)} - ${formatTimeTo12h(sess.end_time)}`,
                          coach: (Array.isArray(sess.coach?.profiles) ? sess.coach.profiles[0] : sess.coach?.profiles)?.full_name || 'Staff',
                          capacity: sess.max_capacity
                        })}
                        className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[9px] shadow-none group/btn transition-all border border-indigo-500/30"
                      >
                         <Users className="mr-2 size-3 opacity-70 group-hover/btn:scale-110 transition-transform" />
                         Gestionar Asistencia
                      </Button>
                    </div>
                  )
                })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
