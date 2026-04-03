"use client"

import * as React from "react"
import { Clock, Search, Filter, Edit2, Trash2, Plus, Loader2 } from "lucide-react"
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
import { useSupabase } from "@/hooks/use-supabase"

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function HorariosPage() {
  const { client, ready, gymId } = useSupabase()
  const [schedules, setSchedules] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchSchedules = React.useCallback(async () => {
    if (!client || !gymId) return

    try {
      setLoading(true)
      const { data, error } = await client
        .from('class_schedules')
        .select(`
          *,
          class_type:class_types(name)
        `)
        .eq('gym_id', gymId)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      setSchedules(data || [])
    } catch (err) {
      console.error("[HorariosPage] Error fetching schedules:", err)
    } finally {
      setLoading(false)
    }
  }, [client, gymId])

  React.useEffect(() => {
    if (ready) {
      fetchSchedules()
    }
  }, [ready, fetchSchedules])

  const deleteSchedule = async (id: string) => {
    if (!client) return
    if (!confirm("¿Estás seguro de eliminar este turno del horario maestro?")) return

    try {
      const { error } = await client
        .from('class_schedules')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchSchedules()
    } catch (err) {
      console.error("Error deleting schedule:", err)
    }
  }

  const filteredSchedules = schedules.filter(s => {
    const search = searchQuery.toLowerCase()
    const dayName = DAYS[s.day_of_week] || ""
    const className = s.class_type?.name?.toLowerCase() || ""
    const scheduleName = s.name?.toLowerCase() || ""
    
    return dayName.toLowerCase().includes(search) || 
           className.includes(search) || 
           scheduleName.includes(search)
  })

  const stats = React.useMemo(() => {
    const am = schedules.filter(s => parseInt(s.start_time.split(":")[0]) < 12).length
    const pm = schedules.length - am
    const totalCapacity = schedules.reduce((acc, s) => acc + (s.capacity || 0), 0)
    return { am, pm, totalCapacity }
  }, [schedules])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Horarios</h1>
          <p className="text-zinc-500 text-sm font-medium">
            Configure sus horarios fijos y proyecte las sesiones al calendario real.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
        
          <div className="h-8 w-px bg-white/5 hidden sm:block mx-1" />
          <AddScheduleModal onSuccess={fetchSchedules} />
        </div>
      </div>

      {/* Toolbar de Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por descripción o servicio..." 
            className="rounded-2xl bg-zinc-900/40 border-white/5 h-11 pl-10 focus:border-indigo-500/50 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          onClick={fetchSchedules}
          className="rounded-2xl border border-white/5 bg-zinc-900/20 text-zinc-400 h-11 px-4 hover:text-white"
        >
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Filter className="mr-2 size-4" />}
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
              {filteredSchedules.map((item) => (
                <ActionTableRow key={item.id}>
                  <ActionTableCell className="text-[13px] font-bold text-white">{DAYS[item.day_of_week]}</ActionTableCell>
                  <ActionTableCell className="text-[13px] font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {item.name || item.class_type?.name}
                  </ActionTableCell>
                  <ActionTableCell>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-black font-mono">
                      {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                    </span>
                  </ActionTableCell>
                  <ActionTableCell className="text-[13px] font-bold text-white text-center">
                    {item.capacity}
                  </ActionTableCell>
                  <ActionTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-400 transition-all">
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteSchedule(item.id)}
                        className="size-8 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-red-500/70"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </ActionTableCell>
                </ActionTableRow>
              ))}

              {filteredSchedules.length === 0 && !loading && (
                <ActionTableRow>
                   <ActionTableCell colSpan={5} className="h-40 text-center text-zinc-600 italic text-sm">
                      No se encontraron horarios configurados.
                   </ActionTableCell>
                </ActionTableRow>
              )}
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
            <p className="text-3xl font-bold text-white tracking-tight">{stats.am}</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Turnos PM</p>
            <p className="text-3xl font-bold text-white tracking-tight">{stats.pm}</p>
          </div>
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Cupos Totales</p>
            <p className="text-3xl font-bold text-white tracking-tight">{stats.totalCapacity}</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Disponibilidad</p>
            <p className="text-3xl font-bold text-white tracking-tight">
               {schedules.length > 0 ? "Activo" : "Vacío"}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
