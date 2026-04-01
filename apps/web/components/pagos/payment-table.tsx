"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  Download, 
  MoreHorizontal, 
  CreditCard, 
  Calendar, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@workspace/ui/components/avatar"
import { Button } from "@workspace/ui/components/button"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"
import { ActionCardProgress } from "@/components/shared/action-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

const MOCK_PAYMENTS = [
  {
    id: "PAY-001",
    athlete: {
      name: "Juan Pérez",
      id: "ATH-001",
      avatar: "https://i.pravatar.cc/150?u=juan",
      email: "juan.perez@email.com"
    },
    plan: "Plan Mensual Regular",
    period: {
      from: "01 Abr, 2025",
      to: "01 May, 2025"
    },
    expiryDays: 12,
    totalDays: 30,
    amount: "$45.00",
    status: "paid",
    method: "Visa •••• 4242",
    date: "01 Abr, 2025"
  },
  {
    id: "PAY-002",
    athlete: {
      name: "María Rosser",
      id: "ATH-002",
      avatar: "https://i.pravatar.cc/150?u=maria",
      email: "m.rosser@box.com"
    },
    plan: "VIP Trimestral",
    period: {
      from: "15 Mar, 2025",
      to: "15 Jun, 2025"
    },
    expiryDays: 78,
    totalDays: 90,
    amount: "$120.00",
    status: "paid",
    method: "Transferencia",
    date: "15 Mar, 2025"
  },
  {
    id: "PAY-003",
    athlete: {
      name: "Alfredo Curtis",
      id: "ATH-003",
      avatar: "https://i.pravatar.cc/150?u=alfredo",
      email: "alfredo.c@gym.com"
    },
    plan: "Plan Básico",
    period: {
      from: "10 Mar, 2025",
      to: "10 Abr, 2025"
    },
    expiryDays: -2,
    totalDays: 30,
    amount: "$35.00",
    status: "overdue",
    method: "Efectivo",
    date: "10 Mar, 2025"
  },
  {
    id: "PAY-004",
    athlete: {
      name: "Giana Botosh",
      id: "ATH-004",
      avatar: "https://i.pravatar.cc/150?u=giana",
      email: "giana.b@fitness.es"
    },
    plan: "Plan Mensual Regular",
    period: {
      from: "25 Mar, 2025",
      to: "25 Abr, 2025"
    },
    expiryDays: 5,
    totalDays: 30,
    amount: "$45.00",
    status: "pending",
    method: "Visa •••• 8899",
    date: "25 Mar, 2025"
  }
]

function StatusBadge({ status }: { status: string }) {
  const configs = {
    paid: { label: "Pagado", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    overdue: { label: "Moroso", icon: AlertCircle, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    pending: { label: "Pendiente", icon: Clock, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  }
  const config = configs[status as keyof typeof configs] || configs.pending
  const Icon = config.icon

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-fit",
      config.color
    )}>
      <Icon className="size-3" />
      {config.label}
    </div>
  )
}

export function PaymentTable({ filter = "all" }: { filter?: string }) {
  const router = useRouter()
  const filteredPayments = React.useMemo(() => {
    if (filter === "all") return MOCK_PAYMENTS
    return MOCK_PAYMENTS.filter(p => p.status === filter)
  }, [filter])

  return (
    <ActionTableRoot className="border-white/5 bg-black/20 overflow-hidden">
      <ActionTable>
        <ActionTableHeader>
          <tr>
            <ActionTableHead className="pl-6">Atleta / Membresía</ActionTableHead>
            <ActionTableHead className="hidden md:table-cell">Periodo de Vigencia</ActionTableHead>
            <ActionTableHead className="hidden lg:table-cell">Vencimiento</ActionTableHead>
            <ActionTableHead className="text-center">Estado</ActionTableHead>
            <ActionTableHead className="text-right">Monto</ActionTableHead>
            <ActionTableHead className="w-20 text-center pr-6">Recibo</ActionTableHead>
          </tr>
        </ActionTableHeader>
        <ActionTableBody>
          <AnimatePresence mode="popLayout">
            {filteredPayments.map((payment, i) => (
              <motion.tr
                key={payment.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.04 }}
                className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
              >
                <ActionTableCell className="pl-6 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-11 rounded-2xl border-2 border-white/5 ring-1 ring-white/5 overflow-hidden">
                       <AvatarImage src={payment.athlete.avatar} />
                       <AvatarFallback className="bg-zinc-800 text-[10px] font-black text-zinc-500">{payment.athlete.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white tracking-tight text-sm truncate">
                        {payment.athlete.name}
                      </span>
                      <span className="text-[11px] text-indigo-400/80 font-bold tracking-tight pt-0.5">
                        {payment.plan}
                      </span>
                    </div>
                  </div>
                </ActionTableCell>

                <ActionTableCell className="hidden md:table-cell">
                   <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-400">
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Desde</span>
                         <span>{payment.period.from}</span>
                      </div>
                      <ArrowRight className="size-3 text-zinc-700" />
                      <div className="flex flex-col gap-0.5">
                         <span className="text-[9px] text-zinc-600 uppercase tracking-widest leading-none">Hasta</span>
                         <span>{payment.period.to}</span>
                      </div>
                   </div>
                </ActionTableCell>

                <ActionTableCell className="hidden lg:table-cell w-48">
                   <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                         <span className={payment.expiryDays <= 5 ? "text-rose-400" : "text-zinc-500"}>
                           {payment.expiryDays < 0 ? "Vencido" : payment.expiryDays === 0 ? "Vence hoy" : `En ${payment.expiryDays} días`}
                         </span>
                         <span className="text-zinc-600">{Math.round((payment.expiryDays / payment.totalDays) * 100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(0, Math.min(100, (payment.expiryDays / payment.totalDays) * 100))}%` }}
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            payment.expiryDays <= 5 ? "bg-rose-500" : "bg-indigo-500"
                          )}
                        />
                      </div>
                   </div>
                </ActionTableCell>

                <ActionTableCell>
                   <div className="flex justify-center">
                     <StatusBadge status={payment.status} />
                   </div>
                </ActionTableCell>

                <ActionTableCell className="text-right">
                   <div className="flex flex-col items-end gap-0.5">
                      <span className="text-sm font-black text-white tracking-tighter">{payment.amount}</span>
                      <span className="text-[10px] text-zinc-600 font-bold flex items-center gap-1">
                        <CreditCard className="size-3" />
                        {payment.method}
                      </span>
                   </div>
                </ActionTableCell>

                <ActionTableCell className="pr-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-zinc-400 hover:text-indigo-400 transition-all"
                        onClick={() => router.push(`/dashboard/pagos/${payment.id}`)}
                      >
                        <Download className="size-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-white/10 text-zinc-600 hover:text-white transition-all">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-white/5 bg-zinc-950 p-2 min-w-[160px]">
                           <DropdownMenuLabel className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 py-2">Opciones</DropdownMenuLabel>
                           <DropdownMenuSeparator className="bg-white/5" />
                           <DropdownMenuItem 
                              className="rounded-xl focus:bg-white/5 font-semibold text-xs px-3 py-2.5 gap-2 cursor-pointer transition-colors"
                              onClick={() => router.push(`/dashboard/pagos/${payment.id}`)}
                           >
                              <FileText className="size-3.5" /> Ver detalles
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </ActionTableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </ActionTableBody>
      </ActionTable>

      <div className="p-6 border-t border-white/5 bg-white/1 flex items-center justify-between">
         <p className="text-[11px] font-bold text-zinc-500 tracking-wider">Mostrando {filteredPayments.length} registros de atletas activos</p>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 border-white/10 bg-transparent hover:bg-white/5 text-xs font-bold disabled:opacity-30" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 border-white/10 bg-transparent hover:bg-white/5 text-xs font-bold">Siguiente</Button>
         </div>
      </div>
    </ActionTableRoot>
  )
}
