"use client"

import * as React from "react"
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Zap, 
  Search, 
  Activity,
  History,
  Timer,
  FileText,
  Monitor,
  Maximize2,
  ChevronDown,
  Medal,
  Crown
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { ActionCard, ActionCardHeader, ActionCardContent, ActionCardFooter, ActionCardAvatar, ActionCardTags } from "@/components/shared/action-card"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { useSearchParams, useRouter } from "next/navigation"

// --- MOCK DATA ---

const MOCK_WOD = {
  title: "Misión del Lunes: 'Turbo Ghost'",
  type: "AMRAP 15 MINUTES",
  parts: [
    { title: "Buy-In", content: "800m Run" },
    { title: "The Work", content: "15 Thrusters (95/65lb)\n12 Pull-ups\n9 Burpees over Bar" }
  ],
  focus: ["Hombros", "Capacidad Aeróbica"],
  date: "Lunes, 30 de Marzo 2026"
}

const LEADERBOARD_RESULTS = [
  { id: "1", athlete: "Ana Belén", result: "8 Rounds + 2", type: "RX", class: "07:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=4", note: "¡Mejor marca personal!" },
  { id: "2", athlete: "Carlos Ruiz", result: "7 Rounds + 4", type: "RX", class: "06:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=1", note: "Fue brutal." },
  { id: "3", athlete: "Silvia Luna", result: "6 Rounds + 10", type: "RX", class: "08:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=5", note: "Los thrusters me mataron." },
  { id: "4", athlete: "María Garcia", result: "6 Rounds", type: "RX", class: "06:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=2", note: "" },
  { id: "5", athlete: "Roberto Soto", result: "245 Reps", type: "Scaled", class: "07:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=3", note: "" },
  { id: "6", athlete: "David Vega", result: "230 Reps", type: "Scaled", class: "09:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=10", note: "" },
  { id: "7", athlete: "Laura M.", result: "5 Rounds", type: "RX", class: "10:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=11", note: "" },
  { id: "8", athlete: "Jorge P.", result: "210 Reps", type: "Scaled", class: "06:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=12", note: "" },
  { id: "9", athlete: "Lucia Diaz", result: "5 Rounds + 2", type: "RX", class: "07:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=13", note: "" },
  { id: "10", athlete: "Marcos G.", result: "195 Reps", type: "Scaled", class: "08:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=14", note: "" },
  { id: "11", athlete: "Elena Sol", result: "5 Rounds", type: "RX", class: "09:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=15", note: "" },
  { id: "12", athlete: "Raul K.", result: "180 Reps", type: "Scaled", class: "10:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=16", note: "" },
  { id: "13", athlete: "Sonia V.", result: "4 Rounds + 15", type: "RX", class: "11:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=17", note: "" },
  { id: "14", athlete: "Ivan T.", result: "170 Reps", type: "Scaled", class: "06:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=18", note: "" },
  { id: "15", athlete: "Paula Z.", result: "4 Rounds + 5", type: "RX", class: "07:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=19", note: "" },
  { id: "16", athlete: "Mikel R.", result: "165 Reps", type: "Scaled", class: "08:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=20", note: "" },
  { id: "17", athlete: "Clara S.", result: "4 Rounds", type: "RX", class: "09:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=21", note: "" },
  { id: "18", athlete: "Toni F.", result: "150 Reps", type: "Scaled", class: "10:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=22", note: "" },
  { id: "19", athlete: "Beatriz L.", result: "3 Rounds + 20", type: "RX", class: "11:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=23", note: "" },
  { id: "20", athlete: "Nico J.", result: "140 Reps", type: "Scaled", class: "06:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=24", note: "" },
  { id: "21", athlete: "Sara Q.", result: "3 Rounds", type: "RX", class: "07:00 AM", gender: "female", avatar: "https://i.pravatar.cc/150?u=25", note: "" },
  { id: "22", athlete: "Alex B.", result: "130 Reps", type: "Scaled", class: "08:00 AM", gender: "male", avatar: "https://i.pravatar.cc/150?u=26", note: "" },
]

// --- SUB-COMPONENTS ---

function PodiumCard({ result, position }: { result: any, position: number }) {
  const isFirst = position === 1
  const colors = {
    1: "border-amber-500 text-amber-500 bg-amber-500/10 shadow-amber-500/20",
    2: "border-zinc-400 text-zinc-400 bg-zinc-400/10 shadow-zinc-400/20",
    3: "border-orange-600 text-orange-600 bg-orange-600/10 shadow-orange-600/20"
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className={cn(
        "relative flex flex-col items-center p-6 rounded-[32px] border-2 backdrop-blur-xl shadow-2xl transition-all hover:scale-105",
        colors[position as keyof typeof colors]
      )}
    >
      {isFirst && (
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-6 bg-amber-500 text-black p-2 rounded-full shadow-lg"
        >
          <Crown className="size-6 fill-current" />
        </motion.div>
      )}
      
      <div className="relative mb-4">
        <Avatar className="size-20 rounded-full border-4 border-current">
          <AvatarImage src={result.avatar} />
          <AvatarFallback className="bg-zinc-800 text-zinc-400 text-sm font-black">
            {result.athlete.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-white flex items-center justify-center text-black font-black text-sm border-2 border-current">
          {position}
        </div>
      </div>

      <h3 className="text-lg font-black uppercase italic tracking-tighter mb-1 text-center line-clamp-1">{result.athlete}</h3>
      <p className="text-2xl font-black italic tracking-tight">{result.result}</p>
      <Badge variant="outline" className="mt-2 border-current/30 text-[10px] font-black uppercase">{result.type}</Badge>
    </motion.div>
  )
}

function RankingList({ results, title, type }: { results: any[], title: string, type: "RX" | "Scaled" }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  // Triple the results for seamless infinite looping
  const loopResults = React.useMemo(() => [...results, ...results, ...results], [results])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el || results.length === 0) return
    
    let scrollAmount = 0
    const step = 0.5

    const animate = () => {
      if (!scrollRef.current) return
      const container = scrollRef.current
      
      // Calculate height of a single set of results
      const singleSetHeight = container.scrollHeight / 3

      scrollAmount += step
      
      // Seamless reset: when we reach the height of one full set, 
      // jump back to 0. Since the content is identical, it's invisible.
      if (scrollAmount >= singleSetHeight) {
        scrollAmount = 0
      }

      container.scrollTo({ top: scrollAmount, behavior: "auto" })
      requestAnimationFrame(animate)
    }

    const animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [results.length])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {title && (
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className={cn(
            "size-10 rounded-2xl flex items-center justify-center shadow-lg",
            type === "RX" ? "bg-amber-500 shadow-amber-500/20" : "bg-[#5e5ce6] shadow-indigo-500/20"
          )}>
            <Trophy className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto scrollbar-none pr-2 pb-10"
      >
        {loopResults.map((res, idx) => {
          // Podium highlight logic should repeat every 'results.length' items
          const absoluteIdx = idx % results.length
          const isPodium = absoluteIdx < 3
          const colors = {
            0: "bg-amber-500/10 border-amber-500/20 text-amber-500",
            1: "bg-slate-400/10 border-slate-400/20 text-slate-400",
            2: "bg-orange-600/10 border-orange-600/20 text-orange-600"
          }
          
          return (
            <motion.div
              key={`${res.id}-${idx}`}
              className={cn(
                "flex items-center justify-between p-4 rounded-[22px] border transition-all",
                isPodium ? colors[absoluteIdx as keyof typeof colors] : "bg-zinc-900/20 border-white/5 hover:bg-white/4"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 flex items-center justify-center">
                   {absoluteIdx === 0 && <Medal className="size-5 fill-current" />}
                   {absoluteIdx === 1 && <Medal className="size-5 fill-current opacity-70" />}
                   {absoluteIdx === 2 && <Medal className="size-5 fill-current opacity-50" />}
                   {absoluteIdx > 2 && <span className="font-black text-lg italic text-zinc-800">{absoluteIdx + 1}</span>}
                </div>
                <Avatar className="size-10 rounded-[12px] border border-white/5">
                  <AvatarImage src={res.avatar} />
                  <AvatarFallback>{res.athlete[0]}</AvatarFallback>
                </Avatar>
                <div>
                   <h4 className={cn("text-xs font-black uppercase", isPodium ? "text-white" : "text-zinc-300")}>
                      {res.athlete}
                   </h4>
                   <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{res.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black italic tracking-tighter">{res.result}</p>
                {isPodium && <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Podio</p>}
              </div>
            </motion.div>
          )
        })}
        {results.length === 0 && (
          <div className="text-center py-20 opacity-20">
             <p className="text-xs font-black uppercase tracking-widest">Sin Resultados</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TvModeLayout({ results }: { results: any[] }) {
  const rxResults = results.filter(r => r.type === "RX")
  const scaledResults = results.filter(r => r.type === "Scaled")
  
  return (
    <div className="fixed inset-0 bg-[#0a0a0c] p-8 lg:p-12 flex flex-col gap-8 lg:gap-12 overflow-hidden scrollbar-none">
      {/* Top Bar */}
      <header className="flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <h1 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter uppercase mb-2">Pizarra <span className="text-[#5e5ce6]">FITCLASS</span></h1>
          <div className="flex items-center gap-4">
             <Badge className="bg-amber-500 text-black font-black px-4 py-1.5 rounded-full text-xs uppercase italic">Resultados del Día</Badge>
             <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{MOCK_WOD.date}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px] mb-1">Entrenamiento</p>
          <h2 className="text-2xl lg:text-3xl font-black text-white italic uppercase tracking-tighter">{MOCK_WOD.title}</h2>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-8 lg:gap-12 flex-1 min-h-0">
        {/* WOD Details */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-0">
           <ActionCard className="h-full bg-linear-to-br from-indigo-950/20 to-zinc-950 border-white/5 flex flex-col p-8 rounded-[40px] overflow-hidden">
              <div className="flex items-center gap-3 mb-6 shrink-0">
                 <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap className="size-5 shadow-glow" />
                 </div>
                 <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">The Work</h3>
              </div>
              
              <div className="flex-1 space-y-8 overflow-y-auto scrollbar-none pr-2">
                {MOCK_WOD.parts.map(part => (
                  <div key={part.title} className="space-y-3">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5e5ce6]">{part.title}</h4>
                     <p className="text-xl lg:text-2xl font-bold text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">{part.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4 shrink-0">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-zinc-600">Time Cap</span>
                    <span className="text-xl font-black text-white italic">15m</span>
                 </div>
                 <div className="w-full flex items-center justify-center h-12 rounded-xl bg-white/5 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest">
                   {MOCK_WOD.type}
                 </div>
              </div>
           </ActionCard>
        </div>

        {/* Leaderboards */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-8 lg:gap-12 min-h-0">
          {/* Podium Area */}
          <div className="grid grid-cols-3 gap-6 shrink-0">
             {rxResults.slice(0, 3).map((res, i) => (
                <PodiumCard key={res.id} result={res} position={i + 1} />
             ))}
          </div>

          {/* Scrolling Lists */}
          <div className="grid grid-cols-2 gap-8 lg:gap-12 flex-1 min-h-0">
             <RankingList results={rxResults} title="RX Ranking" type="RX" />
             <RankingList results={scaledResults} title="Scaled Ranking" type="Scaled" />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE ---

export default function PizarraPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isTvMode = searchParams.get("tv") === "true"
  const [filter, setFilter] = React.useState<"all" | "male" | "female">("all")

  const toggleTvMode = () => {
    const params = new URLSearchParams(searchParams)
    if (isTvMode) params.delete("tv")
    else params.set("tv", "true")
    router.push(`?${params.toString()}`)
  }

  if (isTvMode) {
    return (
      <div className="fixed inset-0 z-100 bg-[#0a0a0c] overflow-hidden scrollbar-none antialiased">
        <TvModeLayout results={LEADERBOARD_RESULTS} />
        {/* Escape Button */}
        <Button 
          variant="ghost" 
          onClick={toggleTvMode}
          className="absolute bottom-4 right-4 text-zinc-800 hover:text-zinc-600 transition-colors z-50"
        >
          Salida (Esc)
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1500px] mx-auto pb-6 pt-4 px-1 h-[calc(100vh-140px)] min-h-[750px]">
      {/* Header Section - More compact */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3 mb-0.5">
             <Badge className="bg-[#5e5ce6] text-white rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                Real-time
             </Badge>
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Centro de Rendimiento</h4>
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Pizarra Digital</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={toggleTvMode}
            className="h-10 rounded-xl bg-white/5 border-white/5 text-zinc-400 font-bold hover:text-white px-4 transition-all shadow-xl font-sans text-xs"
          >
             <Monitor className="size-3.5 mr-2" />
             Modo Pantalla Completa
          </Button>
          <Button className="h-10 rounded-xl bg-[#5e5ce6] text-white font-black uppercase tracking-wider text-[9px] px-6 shadow-lg shadow-indigo-500/10 active:scale-95 transition-all font-sans">
             Nueva Entrada
          </Button>
        </div>
      </section>

      {/* Main Grid Layout: 70/30 changed to 60/40 for more width */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* Left Column (60%) - WOD */}
        <div className="xl:col-span-7 flex flex-col min-h-0">
           <div className="flex items-center justify-between px-1 mb-4 shrink-0">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Programación de Hoy</h2>
           </div>
           
           <ActionCard className="flex-1 flex flex-col border-white/5 bg-zinc-950 min-h-0" decoratorIcon={<Flame className="size-32" />}>
            <ActionCardHeader className="pb-4 shrink-0">
              <div className="flex items-start gap-4">
                 <ActionCardAvatar className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400">
                    <Flame className="size-5 fill-current" />
                 </ActionCardAvatar>
                 <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                       <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-pre-wrap leading-none">
                          {MOCK_WOD.title}
                       </h2>
                       <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest hidden sm:block">{MOCK_WOD.date}</span>
                    </div>
                    <ActionCardTags>
                       <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400">
                          Entrenamiento
                       </span>
                       <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black tracking-widest text-zinc-400 italic">
                          {MOCK_WOD.type}
                       </span>
                    </ActionCardTags>
                 </div>
              </div>
            </ActionCardHeader>
  
            <ActionCardContent className="flex-1 overflow-y-auto scrollbar-none pb-4">
               <div className="space-y-6">
                  {/* Parts Grid */}
                  <div className="grid grid-cols-1 gap-4">
                     {MOCK_WOD.parts.map(part => (
                        <div key={part.title} className="bg-[#131315]/80 p-5 rounded-[22px] border border-white/5 space-y-3 relative overflow-hidden group/part transition-all hover:bg-white/2">
                           <div className="flex items-center gap-2 text-indigo-500/50">
                              <Zap className="size-3.5" />
                              <span className="text-[10px] uppercase font-black tracking-widest">{part.title}</span>
                           </div>
                           <p className="text-[15px] font-medium text-zinc-200 leading-relaxed font-sans whitespace-pre-wrap">
                              {part.content}
                           </p>
                        </div>
                     ))}
                  </div>
  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {[
                        { label: "Time Cap", value: "15m", icon: Timer, color: "text-amber-500" },
                        { label: "Intensidad", value: "HARD", icon: Activity, color: "text-red-500" },
                        { label: "Material", value: "Barra, Pull-up", icon: Activity, color: "text-zinc-500" },
                        { label: "Foco", value: "Hombros", icon: Activity, color: "text-indigo-400" }
                     ].map((metric, i) => (
                        <div key={i} className="bg-zinc-900/30 p-4 rounded-2xl border border-white/5 space-y-1">
                           <div className="flex items-center gap-1.5 text-zinc-600">
                              <metric.icon className="size-3" />
                              <span className="text-[9px] uppercase font-black tracking-widest">{metric.label}</span>
                           </div>
                           <p className={cn("text-xs font-black italic tracking-tighter uppercase", metric.color)}>{metric.value}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </ActionCardContent>
  
            <ActionCardFooter 
              onEdit={() => console.log('Edit WOD')}
              onDelete={() => console.log('Delete WOD')}
              className="bg-white/1 sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0"
            >
               <Button className="h-10 w-full sm:w-auto rounded-xl bg-white text-black font-black uppercase tracking-wider text-[9px] px-8 shadow-2xl hover:bg-zinc-100 transition-all font-sans active:scale-95">
                  <FileText className="size-4 mr-2" />
                  Subir Puntuación
               </Button>
            </ActionCardFooter>
          </ActionCard>
        </div>

        {/* Right Column (40%) - Leaderboard with Auto-scroll */}
        <div className="xl:col-span-5 flex flex-col min-h-0">
           <div className="flex items-center justify-between px-1 mb-4 shrink-0">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Leaderboard</h2>
              <div className="bg-zinc-950 border border-white/5 rounded-full p-0.5 flex">
                 {["all", "male", "female"].map((f) => (
                   <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={cn(
                      "size-6 flex items-center justify-center rounded-full text-[8px] font-black uppercase transition-all",
                      filter === f ? "bg-[#5e5ce6] text-white" : "text-zinc-600 hover:text-zinc-400"
                    )}
                   >
                     {f[0]}
                   </button>
                 ))}
              </div>
           </div>

           <div className="relative bg-zinc-950 border border-white/5 rounded-[32px] p-6 flex-1 flex flex-col overflow-hidden shadow-2xl min-h-0">
              <div className="mb-6 shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                       <Trophy className="size-4" />
                    </div>
                    <span className="text-xs font-black uppercase italic tracking-tighter text-white">Resultados RX</span>
                 </div>
              </div>
              
              <div className="flex-1 min-h-0">
                 <RankingList 
                   results={LEADERBOARD_RESULTS.filter(r => r.type === "RX" && (filter === 'all' || r.gender === filter))} 
                   title="" 
                   type="RX" 
                 />
              </div>
              
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-zinc-950 to-transparent pointer-events-none z-10" />
           </div>
        </div>
      </div>
    </div>
  )
}
