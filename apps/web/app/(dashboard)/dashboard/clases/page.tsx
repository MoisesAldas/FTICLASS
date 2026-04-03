"use client"

import * as React from "react"
import { 
  CalendarDays, 
  Sparkles, 
  LayoutGrid, 
  Award, 
  Plus, 
  Loader2,
  Users
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns"

import { cn } from "@workspace/ui/lib/utils"
import { useSupabase } from "@/hooks/use-supabase"
import { SelectPrimitive } from "@/components/shared/select-primitive"
import { MonthlyCalendar } from "@/components/clases/monthly-calendar"
import { AgendaView } from "@/components/clases/agenda-view"
import { ViewToggle } from "@/components/clases/view-toggle"
import { AttendanceSheet } from "@/components/clases/attendance-sheet"
import { AddClassModal } from "@/components/clases/add-class-modal"

export default function ClasesPage() {
  const router = useRouter()
  const { client, gymId } = useSupabase()
  
  // 1. Estados de Navegación y Vistas
  const [currentView, setCurrentView] = React.useState<'calendar' | 'agenda'>('calendar')
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  // 2. Estados de Datos
  const [sessions, setSessions] = React.useState<any[]>([])
  const [wods, setWods] = React.useState<any[]>([])
  const [coaches, setCoaches] = React.useState<any[]>([])
  const [disciplines, setDisciplines] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // 3. Estados de Filtros
  const [filterCoach, setFilterCoach] = React.useState("all")
  const [filterDiscipline, setFilterDiscipline] = React.useState("all")
  
  // 4. Estado de Asistencia (Sheet)
  const [selectedSession, setSelectedSession] = React.useState<any>(null)
  const [isAttendanceOpen, setIsAttendanceOpen] = React.useState(false)

  // FETCH DATA CENTRALIZADO
  const fetchData = React.useCallback(async () => {
    if (!client || !gymId) return
    setLoading(true)
    
    try {
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(monthStart)
      const fetchStart = startOfWeek(monthStart, { weekStartsOn: 1 })
      const fetchEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

      const [sessRes, wodsRes, coachRes, discRes] = await Promise.all([
        client.from('class_sessions').select(`*, class_type:class_types(id, name, color), coach:coaches(id, profiles(full_name))`)
          .eq('gym_id', gymId)
          .gte('date', format(fetchStart, 'yyyy-MM-dd'))
          .lte('date', format(fetchEnd, 'yyyy-MM-dd')),
        client.from('wods').select('*')
          .eq('gym_id', gymId)
          .gte('date', format(fetchStart, 'yyyy-MM-dd'))
          .lte('date', format(fetchEnd, 'yyyy-MM-dd')),
        client.from('coaches').select('id, profiles(full_name)').eq('gym_id', gymId),
        client.from('class_types').select('id, name').eq('gym_id', gymId)
      ])

      if (sessRes.data) setSessions(sessRes.data)
      if (wodsRes.data) setWods(wodsRes.data)
      if (coachRes.data) setCoaches(coachRes.data)
      if (discRes.data) setDisciplines(discRes.data)
      
      // Sincronizar con el servidor para invalidar cachés de Next.js
      router.refresh()
    } catch (err) {
      console.error("Error fetching classes data:", err)
    } finally {
      setLoading(false)
    }
  }, [client, gymId, currentMonth])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Lógica de Filtrado Local (Pura y Rápida)
  const filteredSessions = sessions.filter(s => {
    const coachMatch = filterCoach === "all" || s.coach_id === filterCoach
    const discMatch = filterDiscipline === "all" || s.class_type_id === filterDiscipline
    return coachMatch && discMatch
  })

  const handleSessionSelect = (sess: any) => {
    setSelectedSession(sess)
    setIsAttendanceOpen(true)
  }

  return (
    <div className="flex flex-col gap-5">
      
      {/* HEADER: TITLE & NEW BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Clases</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Gestión de sesiones, programación de WODs y control de asistencia centralizada.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddClassModal onSuccess={fetchData} />
        </div>
      </div>

      {/* FILTROS Y CONTENIDO */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Filtros de Sesión</h2>
            
            <div className="inline-flex flex-wrap items-center p-1.5 bg-[#131315] border border-white/5 rounded-2xl gap-2 shadow-inner">
               <ViewToggle view={currentView} onViewChange={setCurrentView} />
               
               <div className="h-6 w-px bg-white/5 mx-1 hidden sm:block" />

               <div className="flex items-center gap-2">
                  <SelectPrimitive 
                    options={[
                      { label: "Coaches: Todos", value: "all" }, 
                      ...coaches.map(c => {
                        const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
                        return { label: p?.full_name || 'Coach', value: c.id };
                      })
                    ]}
                    value={filterCoach}
                    onValueChange={setFilterCoach}
                    icon={Award}
                    className="w-full sm:w-40 bg-zinc-900/40 border-white/5 h-9 text-[10px]"
                  />
                  <SelectPrimitive 
                    options={[{ label: "Disciplinas: Todas", value: "all" }, ...disciplines.map(d => ({ label: d.name, value: d.id }))]}
                    value={filterDiscipline}
                    onValueChange={setFilterDiscipline}
                    icon={LayoutGrid}
                    className="w-full sm:w-40 bg-zinc-900/40 border-white/5 h-9 text-[10px]"
                  />
               </div>
            </div>
        </div>

        <div className={cn(
          "flex-1 relative transition-all duration-700 min-h-[500px]",
          loading ? "opacity-40 pointer-events-none grayscale" : "opacity-100"
        )}>
         {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 gap-4">
               <Loader2 className="size-12 text-indigo-500 animate-spin" />
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Actualizando Universo de Clases...</span>
            </div>
         )}

         {currentView === 'calendar' ? (
           <MonthlyCalendar 
              currentDate={currentMonth}
              onMonthChange={setCurrentMonth}
              sessions={filteredSessions}
              wods={wods}
              onSessionSelect={handleSessionSelect}
           />
         ) : (
           <AgendaView 
              sessions={filteredSessions}
              wods={wods}
              onSessionSelect={handleSessionSelect}
           />
         )}
      </div>

      {/* PANEL DE ASISTENCIA GLOBAL */}
      <AttendanceSheet 
        isOpen={isAttendanceOpen}
        onClose={() => setIsAttendanceOpen(false)}
        clase={selectedSession}
      />

      </section>
    </div>
  )
}
