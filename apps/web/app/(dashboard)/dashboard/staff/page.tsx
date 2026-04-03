"use client"

import * as React from "react"
import { Search, Filter, Edit2, Trash2, Award, Loader2 } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { AddStaffModal } from "@/components/staff/add-staff-modal"
import { useSupabase } from "@/hooks/use-supabase"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableRow, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"

export default function StaffPage() {
  const { client, ready, gymId } = useSupabase()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [staffList, setStaffList] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Cargar Staff Real de Supabase (Modo Directo)
  const fetchData = React.useCallback(async () => {
    if (!client || !ready || !gymId) return
    
    setIsLoading(true)
    try {
      // 1. Obtener Coaches Activos
      const { data: coaches, error: coachesError } = await client
        .from('coaches')
        .select('*, profile:profiles(*)')
        .eq('gym_id', gymId)
        .eq('is_active', true)

      if (coachesError) throw coachesError

      // 2. Formatear para la tabla
      const formattedCoaches = coaches?.map(c => ({ 
        ...c, 
        type: 'active',
        email: c.profile?.email,
        phone: c.profile?.phone 
      })) || []

      setStaffList(formattedCoaches)
    } catch (err) {
      console.error("[StaffPage] Error fetching staff data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [client, ready, gymId])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filtrado en memoria para respuesta instantánea
  const filteredStaff = staffList.filter(staff => {
    const fullName = staff.profile?.full_name?.toLowerCase() || ""
    const specialty = staff.specialty?.toLowerCase() || ""
    const email = (staff.email || staff.profile?.email)?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()
    
    return fullName.includes(search) || 
           specialty.includes(search) || 
           email.includes(search)
  })

  // Estadísticas Dinámicas
  const stats = {
    total: staffList.length,
    especialidades: new Set(staffList.map(s => s.specialty).filter(Boolean)).size,
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Staff Operativo</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Directorio de coaches y entrenadores disponibles para asignación de clases y horarios.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddStaffModal onSuccess={fetchData} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar por nombre, especialidad o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-2xl bg-zinc-900/40 border-white/5 h-11 pl-10 focus:border-indigo-500/50 transition-all font-medium text-white shadow-inner"
          />
        </div>
        <Button variant="ghost" className="rounded-2xl border border-white/5 bg-zinc-900/20 text-zinc-400 h-11 px-4 hover:text-white transition-colors">
          <Filter className="mr-2 size-4" />
          Filtros
        </Button>
      </div>

      {/* Staff List Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Equipo en Operación</h2>
        </div>
        
        <ActionTableRoot>
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/20 rounded-[32px] border border-white/5">
              <Loader2 className="size-8 text-indigo-500 animate-spin" />
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Sincronizando Equipo...</p>
            </div>
          ) : (
            <ActionTable>
              <ActionTableHeader>
                <tr>
                  <ActionTableHead>Coach</ActionTableHead>
                  <ActionTableHead>Contacto</ActionTableHead>
                  <ActionTableHead>Rol & Especialidad</ActionTableHead>
                  <ActionTableHead>Estado</ActionTableHead>
                  <ActionTableHead className="text-right">Acciones</ActionTableHead>
                </tr>
              </ActionTableHeader>
              <ActionTableBody>
                {filteredStaff.length === 0 ? (
                  <ActionTableRow>
                    <ActionTableCell colSpan={5} className="h-40 text-center">
                      <div className="flex flex-col items-center gap-2 text-zinc-600">
                        <Award className="size-8 opacity-20" />
                        <p className="text-sm font-medium">No se encontraron coaches registrados</p>
                      </div>
                    </ActionTableCell>
                  </ActionTableRow>
                ) : (
                  filteredStaff.map((staff) => (
                    <ActionTableRow key={staff.id}>
                      <ActionTableCell>
                        <div className="flex flex-col">
                           <span className="text-[14px] font-bold text-white">
                             {staff.profile?.full_name}
                           </span>
                        </div>
                      </ActionTableCell>
                      <ActionTableCell>
                         <div className="flex flex-col gap-0.5">
                           <span className="text-[13px] font-medium text-zinc-300">{staff.email || staff.profile?.email}</span>
                           <span className="text-[11px] font-medium text-zinc-500">{staff.profile?.phone || "—"}</span>
                         </div>
                      </ActionTableCell>
                      <ActionTableCell>
                        <div className="flex flex-col items-start gap-1">
                           <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border border-white/5">
                              {staff.role || "Coach Staff"}
                           </span>
                           <span className="text-[12px] font-semibold text-zinc-500 pl-1">{staff.specialty || "Generalist"}</span>
                        </div>
                      </ActionTableCell>
                      <ActionTableCell>
                         <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                           Confirmado
                         </span>
                      </ActionTableCell>
                      <ActionTableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-white/5 text-zinc-500 transition-all">
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-red-500/10 hover:text-red-400/90 text-red-500/30 transition-all">
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </ActionTableCell>
                    </ActionTableRow>
                  ))
                )}
              </ActionTableBody>
            </ActionTable>
          )}
        </ActionTableRoot>
      </section>

      {/* Metrics Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Métricas del Equipo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5 space-y-1">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Staff Total</p>
            <p className="text-3xl font-bold text-white tracking-tight">{stats.total}</p>
          </div>
          <div className="p-6 rounded-[32px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-1">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-wider">Especialidades</p>
            <p className="text-3xl font-bold text-white tracking-tight">{stats.especialidades}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
