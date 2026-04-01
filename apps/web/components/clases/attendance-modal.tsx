"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Clock, 
  UserPlus2,
  Trash2
} from "lucide-react"

import { ModalPrimitive } from "@/components/shared/modal-primitive"
import { ActionButton } from "@/components/shared/action-button"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface Attendee {
  id: string
  name: string
  status: "reserved" | "present"
  avatar?: string
}

interface AttendanceModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classData: {
    id: string
    name: string
    hour: string
    coach: string
    capacity: number
  }
}

const MOCK_ATTENDEES: Attendee[] = [
  { id: "1", name: "Carlos Ruiz", status: "reserved", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "María Garcia", status: "present", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Roberto Soto", status: "reserved", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Ana Belén", status: "present", avatar: "https://i.pravatar.cc/150?u=4" },
]

export function AttendanceModal({ isOpen, onOpenChange, classData }: AttendanceModalProps) {
  const [attendees, setAttendees] = React.useState<Attendee[]>(MOCK_ATTENDEES)
  const [search, setSearch] = React.useState("")

  const toggleCheckIn = (id: string) => {
    setAttendees(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === "present" ? "reserved" : "present" } : a
    ))
  }

  const removeAttendee = (id: string) => {
    setAttendees(prev => prev.filter(a => a.id !== id))
  }

  const presentCount = attendees.filter(a => a.status === "present").length
  const filteredAttendees = attendees.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <ModalPrimitive 
      open={isOpen} 
      onOpenChange={onOpenChange}
      trigger={<div />} // Managed externally
      title="Gestión de Asistencia"
      description={`Control de entrada para la clase de ${classData.name} - ${classData.hour}. Coach: ${classData.coach}`}
      icon={Users}
      maxWidth="sm:max-w-[700px]"
    >
      <div className="space-y-6">
        {/* Statistics and Quick Add */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
           {/* Stats card */}
           <div className="bg-[#131315]/80 p-5 rounded-[24px] border border-white/5 flex items-center justify-between shadow-inner h-full">
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ocupación Real</p>
                 <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{attendees.length}</span>
                    <span className="text-zinc-500 font-bold text-sm">/ {classData.capacity}</span>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asistieron</p>
                 <p className="text-2xl font-black text-emerald-500">{presentCount}</p>
              </div>
           </div>

           {/* Search / Add Walk-in */}
           <div className="relative group h-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
              <Input 
                placeholder="Buscar o añadir atleta..."
                className="h-full min-h-[74px] bg-[#131315]/80 border-white/5 rounded-[24px] pl-12 pr-6 text-base font-medium placeholder:text-zinc-600 focus-visible:ring-indigo-500/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.length > 2 && (
                 <motion.button 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="absolute right-4 top-1/2 -translate-y-1/2 h-10 px-4 bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                 >
                    <Plus className="inline-block mr-1 size-3.5" /> Nuevo
                 </motion.button>
              )}
           </div>
        </div>

        {/* Attendees List */}
        <div className="space-y-3">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1 mb-2">Lista de Atletas</h3>
           
           <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout" initial={false}>
                 {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee, index) => (
                       <motion.div
                          key={attendee.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                             "flex items-center justify-between p-4 rounded-[22px] border transition-all mb-2",
                             attendee.status === "present" 
                                ? "bg-emerald-500/5 border-emerald-500/20" 
                                : "bg-white/2 border-white/5 hover:bg-white/4"
                          )}
                       >
                          <div className="flex items-center gap-3">
                             <div className="size-11 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-white/5 shrink-0 shadow-lg">
                                <img src={attendee.avatar} alt={attendee.name} className="size-full object-cover" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-base font-bold text-white tracking-tight">{attendee.name}</p>
                                <div className="flex items-center gap-2">
                                   {attendee.status === "present" ? (
                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                                         <CheckCircle2 className="size-2.5" /> Presente
                                      </span>
                                   ) : (
                                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-500/10 text-[9px] font-black uppercase tracking-wider text-zinc-500">
                                         <Clock className="size-2.5" /> Reservado
                                      </span>
                                   )}
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-2">
                             <Button 
                               onClick={() => toggleCheckIn(attendee.id)}
                               className={cn(
                                  "h-10 px-5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                  attendee.status === "present" 
                                     ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700" 
                                     : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 active:scale-95 shadow-none"
                               )}
                             >
                                {attendee.status === "present" ? "Desmarcar" : "Check-in"}
                             </Button>
                             <Button 
                                variant="ghost" 
                                onClick={() => removeAttendee(attendee.id)}
                                className="size-10 rounded-xl text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                             >
                                <Trash2 className="size-4" />
                             </Button>
                          </div>
                       </motion.div>
                    ))
                 ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-white/1 rounded-[32px] border border-dashed border-white/5 mt-4">
                       <UserPlus2 className="size-12 text-zinc-700 mb-4" />
                       <p className="text-zinc-500 font-bold mb-1">Sin atletas encontrados</p>
                       <p className="text-zinc-600 text-[11px] font-medium max-w-[200px]">Utiliza el buscador para añadir atletas a esta clase.</p>
                    </div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </ModalPrimitive>
  )
}
