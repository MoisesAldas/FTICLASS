"use client"

import * as React from "react"
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserMinus,
  Search,
  MoreVertical,
  Activity,
  Loader2,
  Trash2
} from "lucide-react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { useSupabase } from "@/hooks/use-supabase"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"

interface AttendanceSheetProps {
  isOpen: boolean
  onClose: () => void
  clase: {
    id: string
    name: string
    hour: string
    coach: string
    capacity: number
  } | null
}

export function AttendanceSheet({ isOpen, onClose, clase }: AttendanceSheetProps) {
  const { client, gymId } = useSupabase()
  const [loading, setLoading] = React.useState(false)
  const [athletes, setAthletes] = React.useState<any[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")

  const fetchAthletes = React.useCallback(async () => {
    if (!client || !clase?.id) return
    setLoading(true)
    
    const { data, error } = await client
      .from('class_enrollments')
      .select(`
        id,
        status,
        athletes(
          id,
          profiles(full_name, avatar_url)
        )
      `)
      .eq('class_session_id', clase.id)
      .eq('status', 'confirmed')

    if (data) setAthletes(data)
    setLoading(false)
  }, [client, clase?.id])

  React.useEffect(() => {
    if (isOpen && clase?.id) {
      fetchAthletes()
    }
  }, [isOpen, clase?.id, fetchAthletes])

  async function toggleAttendance(enrollmentId: string, currentStatus: string) {
     if (!client) return
     const newStatus = currentStatus === 'attended' ? 'confirmed' : 'attended'
     
     const { error } = await client
        .from('class_enrollments')
        .update({ status: newStatus })
        .eq('id', enrollmentId)

     if (!error) {
        setAthletes(prev => prev.map(a => a.id === enrollmentId ? { ...a, status: newStatus } : a))
        toast.success(newStatus === 'attended' ? "Asistencia marcada" : "Asistencia revertida")
     }
  }

  async function removeAthlete(enrollmentId: string) {
    if (!client) return
    const { error } = await client
       .from('class_enrollments')
       .delete()
       .eq('id', enrollmentId)

    if (!error) {
       setAthletes(prev => prev.filter(a => a.id !== enrollmentId))
       toast.success("Atleta eliminado de la sesión")
    }
  }

  const filteredAthletes = athletes.filter(a => 
    a.athletes?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-white/5 p-0">
        <div className="flex flex-col h-full bg-zinc-950/50 backdrop-blur-xl">
          
          {/* HEADER PREMIUM */}
          <SheetHeader className="p-8 pb-4 space-y-4">
            <div className="flex items-center justify-between">
               <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Gestión de Asistencia
               </Badge>
               <Users className="size-5 text-zinc-700" />
            </div>
            <div>
              <SheetTitle className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                 {clase?.name || "Cargando..." }
              </SheetTitle>
              <SheetDescription className="flex items-center gap-3 pt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {clase?.hour}
                 </span>
                 <span>•</span>
                 <span>Coach: {clase?.coach}</span>
              </SheetDescription>
            </div>
          </SheetHeader>

          {/* BUSCADOR */}
          <div className="px-8 mb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
              <Input 
                placeholder="Buscar atleta por nombre..." 
                className="bg-zinc-900/50 border-white/5 h-12 pl-12 rounded-2xl focus:border-indigo-500/30 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* LISTADO DE ATLETAS */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-none">
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="size-8 text-indigo-500 animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Sincronizando Listado...</span>
                </div>
              ) : filteredAthletes.length > 0 ? (
                filteredAthletes.map((item) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-3xl border transition-all duration-300",
                      item.status === 'attended' 
                        ? "bg-indigo-500/5 border-indigo-500/20" 
                        : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                         <div className="size-10 rounded-2xl bg-zinc-800 border border-white/5 overflow-hidden">
                           {item.athletes?.profiles?.avatar_url ? (
                             <img src={item.athletes.profiles.avatar_url} alt="" className="size-full object-cover" />
                           ) : (
                             <div className="size-full flex items-center justify-center text-zinc-600">
                               <Users className="size-4" />
                             </div>
                           )}
                         </div>
                         {item.status === 'attended' && (
                           <div className="absolute -top-1 -right-1 size-5 rounded-full bg-indigo-500 border-2 border-zinc-950 flex items-center justify-center">
                             <CheckCircle2 className="size-3 text-white" />
                           </div>
                         )}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-white uppercase italic tracking-tight">
                          {item.athletes?.profiles?.full_name}
                        </h4>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                          Socio Activo
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <Button 
                         size="icon" 
                         variant="ghost" 
                         className={cn(
                           "size-10 rounded-full transition-all",
                           item.status === 'attended' ? "text-indigo-400 bg-indigo-500/10" : "text-zinc-600 hover:text-white"
                         )}
                         onClick={() => toggleAttendance(item.id, item.status)}
                       >
                         <CheckCircle2 className="size-5" />
                       </Button>
                       <Button 
                         size="icon" 
                         variant="ghost" 
                         className="size-10 rounded-full text-zinc-800 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                         onClick={() => removeAthlete(item.id)}
                       >
                         <Trash2 className="size-4" />
                       </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-white/5">
                  <Activity className="size-8 text-zinc-800 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Sin atletas confirmados</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-white/5 bg-zinc-950/80">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600">
                <span>Capacidad del Box</span>
                <span>{athletes.length} / {clase?.capacity || 20}</span>
             </div>
             <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500" 
                  style={{ width: `${(athletes.length / (clase?.capacity || 20)) * 100}%` }}
                />
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
