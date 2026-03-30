"use client"

import * as React from "react"
import { Search, Filter, Dumbbell, Timer, LayoutGrid, Edit2, Trash2, CheckCircle2, Eye } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { AddWodModal } from "@/components/wods/add-wod-modal"
import { cn } from "@workspace/ui/lib/utils"
import { ActionCard, ActionCardHeader, ActionCardContent, ActionCardFooter, ActionCardAvatar, ActionCardTags } from "@/components/shared/action-card"
import { ModalPrimitive } from "@/components/shared/modal-primitive"

const MOCK_WODS = [
  { 
    id: 1, 
    titulo: "Murph", 
    categoria: "Hero WOD", 
    duracion: "Time Cap: 60 min", 
    instrucciones: "1 Mile Run\n100 Pull-ups\n200 Push-ups\n300 Squats\n1 Mile Run",
    destacado: true
  },
  { 
    id: 2, 
    titulo: "Fran", 
    categoria: "Benchmark", 
    duracion: "For Time", 
    instrucciones: "21-15-9 Reps For Time:\n- Thrusters (95/65 lb)\n- Pull-ups",
    destacado: false
  },
  { 
    id: 3, 
    titulo: "Fuerza Absoluta 5x5", 
    categoria: "Strength", 
    duracion: "40 min", 
    instrucciones: "Back Squat 5x5 (80% 1RM)\nDescanso: 2 min entre series\n\nAccesorios:\nLeg Extension 3x12\nHamstring Curl 3x12",
    destacado: false
  },
  { 
    id: 4, 
    titulo: "Engine Engine", 
    categoria: "EMOM", 
    duracion: "20 min", 
    instrucciones: "EMOM 20 Minutes:\nMin 1: 15 Cal Row\nMin 2: 12 Burpees Over Rower\nMin 3: 40 Double Unders\nMin 4: Descanso",
    destacado: false
  },
]

function WodCard({ wod }: { wod: typeof MOCK_WODS[0] }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <>
      <ModalPrimitive
         open={isModalOpen}
         onOpenChange={setIsModalOpen}
         title={wod.titulo}
         description={`Cat. ${wod.categoria} • ${wod.duracion}`}
         trigger={<span className="hidden" />}
         maxWidth="sm:max-w-2xl"
      >
         <div className="bg-[#131315]/80 p-6 rounded-2xl border border-white/5 shadow-2xl mt-4">
           <pre className="font-mono text-[13px] leading-relaxed text-zinc-300 w-full whitespace-pre-wrap">
             {wod.instrucciones}
           </pre>
         </div>
      </ModalPrimitive>

      <ActionCard 
        isActive={wod.destacado} 
        decoratorIcon={<Dumbbell className="size-20 opacity-50" />}
      >
         <ActionCardHeader className="pb-4">
            <div className="flex items-start gap-4">
               <ActionCardAvatar className={wod.destacado ? "bg-indigo-500/10 border-indigo-500/20" : ""}>
                  <Dumbbell className={cn("size-5", wod.destacado ? "text-indigo-400" : "text-zinc-400")} />
               </ActionCardAvatar>
               
               <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter truncate">{wod.titulo}</h3>
                    {wod.destacado && (
                      <CheckCircle2 className="size-4 shrink-0 text-indigo-500" />
                    )}
                  </div>
                  <ActionCardTags>
                     <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 inline-flex items-center gap-1.5">
                       {wod.categoria}
                     </span>
                  </ActionCardTags>
               </div>
            </div>
         </ActionCardHeader>

         <ActionCardContent className="pt-0 flex flex-col h-full">
            <div className="space-y-4 flex flex-col h-full">
               <div className="grid grid-cols-1 gap-2">
                  <div className="bg-[#131315]/80 px-4 py-3 rounded-2xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-zinc-500">
                        <Timer className="size-3.5" />
                        <span className="text-[10px] uppercase font-black tracking-widest">Duración / Formato</span>
                     </div>
                     <span className="text-[12px] font-bold text-white">{wod.duracion}</span>
                  </div>
               </div>

               <div className="pt-3 border-t border-white/5 flex flex-col gap-3 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 pl-1 shrink-0">Specs. Técnicas</span>
                  
                  <div 
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl bg-[#131315]/80 border border-white/5 p-4 flex-1 h-[100px] relative overflow-hidden group hover:border-indigo-500/30 transition-colors cursor-pointer select-none"
                  >
                    <pre className="font-mono text-[11px] leading-relaxed text-zinc-400 whitespace-pre-wrap line-clamp-3">
                      {wod.instrucciones}
                    </pre>

                    {/* Fading Block */}
                    <div className="absolute inset-0 top-1/4 bg-linear-to-t from-[#131315] to-transparent pointer-events-none" />
                    
                    {/* Glassmorphism Inspector Trigger */}
                    <div className="absolute inset-x-0 bottom-3 flex justify-center">
                       <Button 
                         variant="ghost"
                         onClick={(e) => {
                           e.stopPropagation()
                           setIsModalOpen(true)
                         }}
                         className="h-8 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                       >
                         <Eye className="size-3 mr-2" />
                         Inspeccionar
                       </Button>
                    </div>
                  </div>

               </div>
            </div>
         </ActionCardContent>

         <ActionCardFooter 
           onEdit={() => console.log('Edit', wod.id)}
           onDelete={() => console.log('Delete', wod.id)}
         />
      </ActionCard>
    </>
  )
}

export default function WodsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Librería de WODs</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Catálogo global de entrenamientos pre-programados listos para asignar a tus rutinas de clase.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AddWodModal />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Buscar rutina por nombre, modalidad o ejercicios (ej. Thrusters)..." 
            className="rounded-2xl bg-zinc-900/40 border-white/5 h-11 pl-10 focus:border-indigo-500/50 transition-all font-medium text-white"
          />
        </div>
        <Button variant="ghost" className="rounded-2xl border border-white/5 bg-zinc-900/20 text-zinc-400 h-11 px-6 hover:text-white transition-colors">
          <Filter className="mr-2 size-4" />
          Categorías
        </Button>
      </div>

      {/* Grid of WOD Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Ejercicios Registrados</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
           {MOCK_WODS.map((wod) => (
             <WodCard key={wod.id} wod={wod} />
           ))}
        </div>
      </section>
    </div>
  )
}
