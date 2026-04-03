"use client"

import * as React from "react"
import { Edit2, Loader2, LayoutGrid, Plus } from "lucide-react"

import { AddServiceModal } from "@/components/services/add-service-modal"
import { Button } from "@workspace/ui/components/button"
import { useSupabase } from "@/hooks/use-supabase"
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
  const { client, ready, gymId } = useSupabase()
  const [services, setServices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchServices = React.useCallback(async () => {
    if (!client || !gymId) return
    
    try {
      setLoading(true)
      const { data, error } = await client
        .from('services')
        .select('*')
        .eq('gym_id', gymId)
        .order('name', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (err) {
      console.error("[ServiciosPage] Error fetching services:", err)
    } finally {
      setLoading(false)
    }
  }, [client, gymId])

  React.useEffect(() => {
    if (ready) {
      fetchServices()
    }
  }, [ready, fetchServices])

  const stats = React.useMemo(() => ({
    count: services.length,
    activeCount: services.filter(s => s.is_active).length
  }), [services])

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter">Disciplinas</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Gestione la oferta deportiva y las reglas de reserva de su box.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddServiceModal />
        </div>
      </div>

      {/* 1. Listado Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Listado de Servicios</h2>
        </div>
        
        <ActionTableRoot>
          <ActionTable>
            <ActionTableHeader>
              <tr>
                <ActionTableHead>Nombre / Disciplina</ActionTableHead>
                <ActionTableHead>Estado</ActionTableHead>
                <ActionTableHead>Descripción</ActionTableHead>
                <ActionTableHead className="text-right">Acciones</ActionTableHead>
              </tr>
            </ActionTableHeader>
            <ActionTableBody>
              {loading ? (
                <ActionTableRow>
                  <ActionTableCell colSpan={4} className="h-40 text-center">
                    <Loader2 className="size-6 animate-spin mx-auto text-indigo-500" />
                  </ActionTableCell>
                </ActionTableRow>
              ) : services.map((item) => (
                <ActionTableRow key={item.id}>
                  <ActionTableCell className="text-[13px] font-bold text-white tracking-tight uppercase">
                    {item.name}
                  </ActionTableCell>
                  <ActionTableCell>
                    {item.is_active ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider">Activo</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 text-[10px] font-black uppercase tracking-wider">Inactivo</span>
                    )}
                  </ActionTableCell>
                  <ActionTableCell className="text-[13px] font-semibold text-zinc-500 italic">
                    {item.description || "Sin descripción"}
                  </ActionTableCell>
                  <ActionTableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-lg hover:bg-indigo-500/10 text-zinc-500 hover:text-indigo-400 transition-all font-bold"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                  </ActionTableCell>
                </ActionTableRow>
              ))}

              {!loading && services.length === 0 && (
                <ActionTableRow>
                   <ActionTableCell colSpan={4} className="h-40 text-center text-zinc-600 italic text-sm">
                      Aún no ha configurado ningún servicio.
                   </ActionTableCell>
                </ActionTableRow>
              )}
            </ActionTableBody>
          </ActionTable>
        </ActionTableRoot>
      </section>

      {/* 2. Metrics Section */}
      <section className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Análisis de Oferta</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-8 rounded-[38px] bg-zinc-900/40 border border-white/5 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <LayoutGrid className="size-16 text-white" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Disciplinas Totales</p>
            <p className="text-4xl font-black text-white tracking-tighter">{stats.count}</p>
          </div>
          <div className="p-8 rounded-[38px] bg-zinc-900/40 border border-white/5 space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500">
              <Plus className="size-16" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Activos Ahora</p>
            <p className="text-4xl font-black text-white tracking-tighter">{stats.activeCount}</p>
          </div>
          <div className="p-8 rounded-[38px] bg-[#5e5ce6]/10 border border-[#5e5ce6]/20 space-y-2 relative overflow-hidden">
            <p className="text-[#5e5ce6] text-[10px] font-black uppercase tracking-widest">Estado Operativo</p>
            <p className="text-4xl font-black text-white tracking-tighter">
              {stats.activeCount > 0 ? "Configurado" : "Pendiente"}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
