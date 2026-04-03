"use client"

import * as React from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Flame
} from "lucide-react"
import { 
  addMonths, 
  subMonths, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO
} from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { formatTimeTo12h } from "@/lib/format"

interface MonthlyCalendarProps {
  currentDate: Date
  onMonthChange: (date: Date) => void
  sessions: any[]
  wods?: any[]
  onSessionSelect: (session: any) => void
}

export function MonthlyCalendar({ 
  currentDate, 
  onMonthChange, 
  sessions, 
  wods = [],
  onSessionSelect 
}: MonthlyCalendarProps) {
  
  // Generar grid de días
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const nextMonth = () => onMonthChange(addMonths(currentDate, 1))
  const prevMonth = () => onMonthChange(subMonths(currentDate, 1))

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* NAVEGACIÓN DE MES INTEGRADA */}
      <div className="flex items-center gap-4 px-2">
         <div className="flex items-center bg-zinc-900/40 p-1 rounded-2xl border border-white/5">
            <Button size="icon" variant="ghost" onClick={prevMonth} className="size-9 rounded-xl hover:bg-white/5">
              <ChevronLeft className="size-4" />
            </Button>
            <div className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
               {format(currentDate, 'MMMM yyyy', { locale: es })}
            </div>
            <Button size="icon" variant="ghost" onClick={nextMonth} className="size-9 rounded-xl hover:bg-white/5">
              <ChevronRight className="size-4" />
            </Button>
         </div>
      </div>

      {/* GRID DEL CALENDARIO */}
      <div className="bg-zinc-950/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
          {/* Header Días */}
          <div className="grid grid-cols-7 border-b border-white/5 bg-zinc-900/10">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  {day}
                </div>
              ))}
          </div>

          {/* Grid de Cuerpo */}
          <div className="grid grid-cols-7 auto-rows-fr relative">
             {calendarDays.map((day, idx) => {
                const daySessions = sessions.filter(s => isSameDay(parseISO(s.date), day))
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isTodayDate = isToday(day)

                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "min-h-[140px] border-r border-b border-white/5 p-3 flex flex-col gap-2 transition-all group",
                      isCurrentMonth ? "hover:bg-white/2" : "opacity-10 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                       <span className={cn(
                         "size-8 flex items-center justify-center rounded-xl text-[11px] font-black transition-all italic",
                         isTodayDate ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 -rotate-2" : "text-zinc-600 group-hover:text-white"
                       )}>
                          {format(day, 'd')}
                       </span>
                    </div>

                    <div className="flex flex-col gap-1.5 overflow-y-auto scrollbar-none max-h-[120px]">
                        {daySessions.map(sess => {
                          // Buscar WOD por link directo en notas o por fecha
                          let sessionWod = null
                          if (sess.notes?.startsWith('WOD: ')) {
                            const wodId = (sess.notes as string).replace('WOD: ', '').trim()
                            sessionWod = wods.find(w => w.id === wodId)
                          }
                          if (!sessionWod) {
                            sessionWod = wods.find(w => w.date === sess.date)
                          }

                          const hasWod = !!sessionWod
                          return (
                            <button
                              key={sess.id}
                              onClick={() => {
                                const p = Array.isArray(sess.coach?.profiles) ? sess.coach.profiles[0] : sess.coach?.profiles;
                                onSessionSelect({
                                  id: sess.id,
                                  name: sess.class_type?.name,
                                  hour: `${format(new Date(`${sess.date}T${sess.start_time}`), 'HH:mm')} - ${format(new Date(`${sess.date}T${sess.end_time}`), 'HH:mm')}`,
                                  coach: p?.full_name || 'Staff',
                                  capacity: sess.max_capacity
                                })
                              }}
                              className={cn(
                                "w-full text-left p-2 rounded-xl border border-white/5 transition-all text-[10px] shadow-sm relative overflow-hidden",
                                "bg-zinc-900/40 hover:bg-zinc-900 hover:border-white/20 hover:scale-[1.03] active:scale-95 pl-3"
                              )}
                            >
                               {/* Color Strip Indicator */}
                               <div 
                                 className="absolute left-0 top-0 bottom-0 w-1 opacity-60"
                                 style={{ backgroundColor: sess.class_type?.color || '#6366f1' }}
                               />

                               <div className="flex items-center gap-1.5 w-full">
                                  <span className="text-[7px] font-bold text-indigo-400/90 font-mono shrink-0">
                                    {formatTimeTo12h(sess.start_time).split(' ')[0]}
                                  </span>
                                  
                                  <span className="font-black text-white italic uppercase tracking-tighter truncate leading-none flex-1 min-w-0 text-[9px]">
                                    {sess.class_type?.name}
                                  </span>

                                  <div className="flex items-center gap-1 shrink-0 bg-white/5 px-1 rounded-sm">
                                    <Users className="size-2 text-zinc-500" />
                                    <span className="text-[7px] font-bold text-zinc-400">{sess.current_enrolled || 0}</span>
                                  </div>
                                  
                                  {hasWod && (
                                     <Flame className="size-2 text-amber-500 shrink-0" />
                                  )}
                               </div>
                            </button>
                          )
                        })}
                    </div>
                  </div>
                )
             })}
          </div>
      </div>
    </div>
  )
}
