"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Plus, 
  Clock, 
  UserPlus2,
  Trash2,
  Loader2,
  X
} from "lucide-react"

import { ModalPrimitive } from "@/components/shared/modal-primitive"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useSupabase } from "@/hooks/use-supabase"
import { toast } from "sonner"

interface AttendanceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  classData: {
    id: string
    name: string
    hour: string
    coach: string
    capacity: number
    enrolled: number
  }
}

export function AttendanceModal({ isOpen, onOpenChange, classData, onSuccess }: AttendanceModalProps) {
  const { client, gymId } = useSupabase()
  const [attendees, setAttendees] = React.useState<any[]>([])
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState<string | null>(null)
  const [searchResults, setSearchResults] = React.useState<any[]>([])

  const fetchAttendees = React.useCallback(async () => {
    if (!client || !classData.id) return
    setLoading(true)
    try {
      const { data, error } = await client
        .from('class_enrollments')
        .select(`
          *,
          athlete:athletes(
            id,
            profile:profiles(full_name, avatar_url)
          )
        `)
        .eq('class_session_id', classData.id)
        .order('enrolled_at', { ascending: true })

      if (error) throw error
      setAttendees(data || [])
    } catch (err) {
      console.error("Error fetching attendees:", err)
    } finally {
      setLoading(false)
    }
  }, [client, classData.id])

  React.useEffect(() => {
    if (isOpen) {
      fetchAttendees()
    }
  }, [isOpen, fetchAttendees])

  // Simple athlete search
  React.useEffect(() => {
    const searchAthletes = async () => {
      if (!client || !gymId || search.length < 3) {
        setSearchResults([])
        return
      }
      
      const { data, error: searchError } = await client
        .from('athletes')
        .select(`
          id,
          profile:profiles!inner(full_name)
        `)
        .eq('gym_id', gymId)
        .ilike('profile.full_name', `%${search}%`)
        .limit(5)
      
      if (searchError) {
        console.error("Search error:", searchError)
        return
      }
      
      setSearchResults(data || [])
    }
    const timer = setTimeout(searchAthletes, 300)
    return () => clearTimeout(timer)
  }, [client, gymId, search])

  const toggleCheckIn = async (enrollment: any) => {
    if (!client) return
    const newStatus = enrollment.status === "attended" ? "confirmed" : "attended"
    setIsSubmitting(enrollment.id)
    
    try {
      const { error } = await client
        .from('class_enrollments')
        .update({ status: newStatus })
        .eq('id', enrollment.id)

      if (error) throw error
      fetchAttendees()
      onSuccess?.()
    } catch (err) {
      toast.error("Error al actualizar estado")
    } finally {
      setIsSubmitting(null)
    }
  }

  const removeAttendee = async (id: string) => {
    if (!client) return
    if (!confirm("¿Eliminar reserva?")) return

    try {
      const { error } = await client
        .from('class_enrollments')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchAttendees()
      onSuccess?.()
    } catch (err) {
      toast.error("Error al eliminar reserva")
    }
  }

  const addAthlete = async (athleteId: string) => {
    if (!client || !gymId) return
    if (attendees.some(a => a.athlete_id === athleteId)) {
        toast.error("El atleta ya está inscrito")
        return
    }

    try {
      const { error } = await client
        .from('class_enrollments')
        .insert([{
          class_session_id: classData.id,
          gym_id: gymId,
          athlete_id: athleteId,
          status: 'confirmed'
        }])

      if (error) throw error
      setSearch("")
      setSearchResults([])
      fetchAttendees()
      onSuccess?.()
      toast.success("Atleta inscrito")
    } catch (err) {
      toast.error("Error al inscribir")
    }
  }

  const presentCount = attendees.filter(a => a.status === "attended").length

  return (
    <ModalPrimitive 
      open={isOpen} 
      onOpenChange={onOpenChange}
      trigger={<div />}
      title="Asistencia"
      description={`${classData.name} - ${classData.hour}`}
      icon={Users}
      maxWidth="sm:max-w-[600px]"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between p-5 bg-zinc-900/40 border border-white/5 rounded-2xl">
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase">Inscritos</p>
              <p className="text-2xl font-bold text-white">{attendees.length} / {classData.capacity}</p>
           </div>
           <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-emerald-500 uppercase">Presentes</p>
              <p className="text-2xl font-bold text-emerald-500">{presentCount}</p>
           </div>
        </div>

        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
           <Input 
             placeholder="Buscar atleta para inscribir..."
             className="bg-zinc-900 border-white/5 rounded-2xl pl-10 h-10 text-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
           {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl p-1 z-50 shadow-xl">
                 {searchResults.map(result => (
                    <button 
                      key={result.id}
                      onClick={() => addAthlete(result.id)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white"
                    >
                       <Plus className="size-3" /> {result.profile?.full_name}
                    </button>
                 ))}
              </div>
           )}
        </div>

        <div className="space-y-2">
           <h3 className="text-[10px] font-bold uppercase text-zinc-500 px-1">Lista de Clase</h3>
           <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
              <AnimatePresence mode="popLayout">
                 {attendees.map((item) => (
                    <motion.div
                       key={item.id}
                       layout
                       className={cn(
                          "flex items-center justify-between p-3 rounded-2xl border transition-all",
                          item.status === "attended" 
                             ? "bg-emerald-500/5 border-emerald-500/20" 
                             : "bg-zinc-900/20 border-white/5"
                       )}
                    >
                       <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl overflow-hidden bg-zinc-800 border border-white/5">
                             <img src={item.athlete?.profile?.avatar_url || `https://avatar.vercel.sh/${item.id}`} className="size-full object-cover" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white">{item.athlete?.profile?.full_name}</p>
                             <p className="text-[10px] text-zinc-500 uppercase">{item.status === "attended" ? "Asistió" : "Confirmado"}</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => toggleCheckIn(item)}
                            disabled={isSubmitting === item.id}
                            className={cn(
                               "h-8 px-4 rounded-xl text-[10px] font-bold uppercase transition-all",
                               item.status === "attended" 
                                  ? "bg-zinc-800 text-zinc-400 hover:text-white" 
                                  : "bg-white text-zinc-950 hover:bg-zinc-200"
                            )}
                          >
                             {isSubmitting === item.id ? "..." : item.status === "attended" ? "Anular" : "Check-in"}
                          </Button>
                          <Button 
                             variant="ghost" 
                             onClick={() => removeAttendee(item.id)}
                             className="size-8 rounded-xl text-zinc-600 hover:text-red-500"
                          >
                             <Trash2 className="size-4" />
                          </Button>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </ModalPrimitive>
  )
}
