"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { DollarSign, Wallet, CreditCard } from "lucide-react"

import { PaymentKpis } from "@/components/pagos/payment-kpis"
import { PaymentToolbar } from "@/components/pagos/payment-toolbar"
import { PaymentTable } from "@/components/pagos/payment-table"
import { cn } from "@workspace/ui/lib/utils"

const FILTERS = [
  { id: "all", label: "Todo el historial" },
  { id: "paid", label: "Pagados" },
  { id: "pending", label: "Pendientes" },
  { id: "overdue", label: "Vencidos / Morosos" },
]

export default function PagosPage() {
  const [activeFilter, setActiveFilter] = React.useState("all")

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 px-1">
          <div className="flex items-center gap-2 text-[#5e5ce6] font-black uppercase text-[10px] tracking-[0.2em] mb-1">
             <Wallet className="size-3.5" />
             Administración Financiera
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tighter">Pagos y Membresías</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Control de ingresos, ciclos de facturación y seguimiento de morosidad de atletas en tiempo real.
          </p>
        </div>
      </div>

      {/* Analysis Section (KPIs) - Placed at top for financial focus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Análisis de Ingresos</h2>
           <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
              Actualización en vivo
           </div>
        </div>
        <PaymentKpis />
      </section>

      {/* Main Content: Table & Controls */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Listado de Movimientos</h2>
             
             {/* Extended Quick Filters */}
             <div className="inline-flex items-center p-1 bg-[#131315] border border-white/5 rounded-2xl w-full sm:w-auto overflow-x-auto shadow-inner">
                {FILTERS.map((filter) => (
                   <button
                     key={filter.id}
                     onClick={() => setActiveFilter(filter.id)}
                     className={cn(
                        "px-5 h-9 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                        activeFilter === filter.id 
                           ? "bg-[#5e5ce6] text-white shadow-lg shadow-indigo-500/20" 
                           : "text-zinc-500 hover:text-white hover:bg-white/5"
                     )}
                   >
                     {filter.label}
                   </button>
                ))}
             </div>
          </div>

          <div className="bg-[#131315]/40 backdrop-blur-sm rounded-[32px] border border-white/5 p-2 shadow-2xl">
             <div className="p-4 border-b border-white/5 mb-2">
                <PaymentToolbar />
             </div>
             <PaymentTable filter={activeFilter} />
          </div>
        </div>
      </section>

      {/* Footer Info / Tip */}
      <div className="mt-4 px-6 py-4 bg-indigo-500/5 rounded-[24px] border border-indigo-500/10 flex items-center gap-4">
         <div className="hidden sm:flex size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 items-center justify-center shrink-0">
            <CreditCard className="size-5 text-indigo-400" />
         </div>
         <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-white tracking-tight">Recordatorio de Conciliación</h4>
            <p className="text-[11px] text-zinc-500 max-w-2xl leading-relaxed">
               Los pagos marcados como <span className="text-amber-400/80 font-bold">Pendientes</span> se conciliarán automáticamente al recibir la notificación del banco o al registrar el comprobante manualmente.
            </p>
         </div>
      </div>
    </div>
  )
}
