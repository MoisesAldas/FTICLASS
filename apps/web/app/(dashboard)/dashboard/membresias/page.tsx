import { 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  History, 
  ArrowRight, 
  Download,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"

import { 
  ActionCard, 
  ActionCardHeader, 
  ActionCardContent, 
  ActionCardFooter, 
  ActionCardAvatar, 
  ActionCardProgress
} from "@/components/shared/action-card"
import { ActionButton } from "@/components/shared/action-button"
import { 
  ActionTable,
  ActionTableRoot,
  ActionTableHeader,
  ActionTableBody,
  ActionTableRow,
  ActionTableHead,
  ActionTableCell,
} from "@/components/shared/action-table"

// Mock data
const ACTIVE_MEMBERSHIP = {
  plan: "Full Pass Elite Ilimitado",
  status: "Activo",
  startDate: "15 Ene, 2026",
  endDate: "15 Abr, 2026",
  price: "$120.00",
  daysRemaining: 15,
  totalDays: 90,
  paymentMethod: "Visa **** 4242",
}

const BILLING_HISTORY = [
  { id: 1, date: "15 Ene, 2026", plan: "Full Pass Elite Ilimitado", amount: "$120.00", status: "Pagado" },
  { id: 2, date: "15 Oct, 2025", plan: "Full Pass Elite Ilimitado", amount: "$120.00", status: "Pagado" },
  { id: 3, date: "15 Jul, 2025", plan: "Plan Trimestral", amount: "$110.00", status: "Pagado" },
  { id: 4, date: "15 Abr, 2025", plan: "Mensualidad Regular", amount: "$45.00", status: "Pagado" },
]

export default function MembresiasPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Compact Header */}
      <div className="flex flex-col gap-0.5 px-1 shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-tight">Mi membresía</h1>
        <p className="text-zinc-500 text-sm font-medium">Consulta y gestiona tu suscripción activa</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 min-h-0">
        
        {/* Left Column: Active Membership (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center px-1 shrink-0">
            <h2 className="text-xs font-semibold text-zinc-500 flex items-center gap-2 uppercase tracking-[0.05em]">
              <ShieldCheck className="size-3.5" />
              Suscripción activa
            </h2>
          </div>

          <ActionCard className="rounded-[32px] border-white/5 bg-zinc-950 overflow-hidden flex flex-col">
            <ActionCardHeader className="pb-6 pt-7 px-8 shrink-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <ActionCardAvatar className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 size-12 rounded-xl">
                    <CreditCard className="size-5" />
                  </ActionCardAvatar>
                  <div className="space-y-0.5">
                    <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{ACTIVE_MEMBERSHIP.plan}</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                        <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                        {ACTIVE_MEMBERSHIP.status}
                      </span>
                      <span className="text-[11px] text-zinc-600 font-medium tracking-tight">
                        Ciclo trimestral
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Precio</p>
                  <p className="text-xl font-black text-white leading-none tracking-tighter">{ACTIVE_MEMBERSHIP.price}</p>
                </div>
              </div>
            </ActionCardHeader>

            <ActionCardContent className="space-y-6 pt-0 px-8 flex-1 overflow-y-auto">
              {/* Progress & Quick Info Box */}
              <div className="p-5 rounded-[24px] bg-[#131315] border border-white/5 space-y-5">
                <ActionCardProgress 
                  label="Vigencia del plan" 
                  value={ACTIVE_MEMBERSHIP.daysRemaining} 
                  max={ACTIVE_MEMBERSHIP.totalDays} 
                />
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                  <div className="space-y-0.5">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Iniciada</p>
                    <p className="text-sm font-bold text-white">{ACTIVE_MEMBERSHIP.startDate}</p>
                  </div>
                  <div className="hidden lg:flex justify-center">
                    <ArrowRight className="size-3.5 text-zinc-800" />
                  </div>
                  <div className="space-y-0.5 text-right lg:text-left">
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Finaliza</p>
                    <p className="text-sm font-bold text-indigo-400">{ACTIVE_MEMBERSHIP.endDate}</p>
                  </div>
                  <div className="hidden lg:block space-y-0.5 text-right">
                     <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Próximo cargo</p>
                     <p className="text-sm font-bold text-white">{ACTIVE_MEMBERSHIP.endDate}</p>
                  </div>
                </div>
              </div>

              {/* Account Detail Row */}
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-3">
                   <div className="flex flex-col gap-0.5">
                     <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wide">Método de pago</span>
                     <span className="text-xs font-bold text-white flex items-center gap-2">
                       <CreditCard className="size-3.5 text-indigo-500/50" />
                       {ACTIVE_MEMBERSHIP.paymentMethod}
                     </span>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-2 bg-zinc-900/40 p-2 px-3 rounded-xl border border-white/5 max-w-[280px]">
                    <AlertCircle className="size-3 text-zinc-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 leading-tight">
                      Acceso garantizado hasta el **{ACTIVE_MEMBERSHIP.endDate}** incluso si cancelas hoy.
                    </p>
                 </div>
              </div>
            </ActionCardContent>

            <ActionCardFooter className="pt-4 pb-8 px-8 shrink-0">
              <div className="flex gap-3 w-full">
                <ActionButton 
                  variant="outline" 
                  label="Cancelar membresía"
                  className="flex-1 rounded-xl border-white/10 h-11 bg-transparent hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 text-white font-bold text-[11px]"
                />
                <ActionButton 
                  label="Renovar plan"
                  className="flex-1 rounded-xl h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-none"
                />
              </div>
            </ActionCardFooter>
          </ActionCard>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 shrink-0">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              Pagos recientes
            </h2>
          </div>

          {/* Table Toolbar */}
          <div className="flex flex-col gap-3 px-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
                <input 
                  placeholder="Filtrar historial..." 
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl h-9 pl-9 pr-4 text-[11px] font-medium text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-zinc-700"
                />
              </div>
              <button className="flex items-center gap-2 px-3 border border-white/5 bg-zinc-950 rounded-xl h-9 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                <Filter className="size-3.5" />
                Filtros
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                Todos
              </button>
              <button className="px-3 py-1 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:text-zinc-300 transition-all">
                Pagados
              </button>
              <button className="px-3 py-1 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:text-zinc-300 transition-all">
                Pendientes
              </button>
              <button className="px-3 py-1 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap hover:text-zinc-300 transition-all">
                Trimestral
              </button>
            </div>
          </div>

          <ActionTableRoot>
            <ActionTable>
              <ActionTableHeader>
                <tr>
                  <ActionTableHead className="text-center">Fecha</ActionTableHead>
                  <ActionTableHead className="text-center">Plan</ActionTableHead>
                  <ActionTableHead className="text-center">Monto</ActionTableHead>
                </tr>
              </ActionTableHeader>
              <ActionTableBody>
                {BILLING_HISTORY.slice(0, 4).map((item) => (
                  <ActionTableRow key={item.id}>
                    <ActionTableCell className="text-center">
                      <span className="text-[13px] font-medium text-zinc-400">
                        {item.date}
                      </span>
                    </ActionTableCell>
                    <ActionTableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[14px] font-bold text-white leading-tight">{item.plan}</span>
                        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">{item.status}</span>
                      </div>
                    </ActionTableCell>
                    <ActionTableCell className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-[14px] font-bold text-white">{item.amount}</span>
                        <button className="p-1 rounded-lg hover:bg-white/5 text-zinc-600 hover:text-white transition-all" title="Factura">
                          <Download className="size-3.5" />
                        </button>
                      </div>
                    </ActionTableCell>
                  </ActionTableRow>
                ))}
              </ActionTableBody>
            </ActionTable>
            
            <div className="p-4 border-t border-white/5">
               <div className="flex items-center justify-between px-2">
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2" disabled>
                   <ArrowRight className="size-3 rotate-180" />
                   Anterior
                 </button>
                 <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">
                   Pág. 1 de 3
                 </span>
                 <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-2">
                   Siguiente
                   <ArrowRight className="size-3" />
                 </button>
               </div>
            </div>
          </ActionTableRoot>
        </div>

      </div>
    </div>
  )
}




