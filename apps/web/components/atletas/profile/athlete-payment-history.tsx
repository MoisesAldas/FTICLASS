"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ActionTable, 
  ActionTableRoot,
  ActionTableHeader, 
  ActionTableBody, 
  ActionTableHead, 
  ActionTableCell 
} from "@/components/shared/action-table"
import { CreditCard, CheckCircle2, Clock, XCircle, FileText } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"

export interface PaymentRecord {
  id: string
  date: string
  amount: number
  planName: string
  method: string
  status: "paid" | "pending" | "failed"
}

interface AthletePaymentHistoryProps {
  payments: PaymentRecord[]
}

const statusConfig = {
  paid: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Pagado" },
  pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", label: "Pendiente" },
  failed: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", label: "Fallido" },
}

export function AthletePaymentHistory({ payments }: AthletePaymentHistoryProps) {
  const ITEMS_PER_PAGE = 4
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE)
  const paginatedPayments = payments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col space-y-4 h-full">
      <div className="flex items-center justify-between">
         <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Historial de Pagos</h2>
         <Button variant="ghost" className="h-8 rounded-full text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-colors">
            Descargar Reporte <FileText className="ml-2 size-3.5" />
         </Button>
      </div>
      
      <ActionTableRoot>
        <ActionTable>
          <ActionTableHeader>
            <tr>
              <ActionTableHead className="w-[120px]">Fecha</ActionTableHead>
              <ActionTableHead>Concepto / Plan</ActionTableHead>
              <ActionTableHead>Método</ActionTableHead>
              <ActionTableHead className="text-right">Monto</ActionTableHead>
              <ActionTableHead className="text-center w-[100px]">Estado</ActionTableHead>
            </tr>
          </ActionTableHeader>
          <ActionTableBody>
            <AnimatePresence>
              {payments.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-12 text-center text-sm font-medium text-zinc-500">
                      No hay pagos registrados
                   </td>
                </tr>
              ) : (
                paginatedPayments.map((payment, i) => {
                  const StatusIcon = statusConfig[payment.status].icon
                  const sc = statusConfig[payment.status]

                  return (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors cursor-default"
                    >
                      <ActionTableCell>
                        <span className="text-xs font-bold text-zinc-400 tracking-wider font-mono">
                          {payment.date}
                        </span>
                      </ActionTableCell>
                      
                      <ActionTableCell>
                        <span className="text-sm font-semibold text-white tracking-tight">
                          {payment.planName}
                        </span>
                        <span className="block text-[10px] text-zinc-500 font-medium mt-0.5 tracking-widest uppercase">
                          Ref: {payment.id}
                        </span>
                      </ActionTableCell>

                      <ActionTableCell>
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-3.5 text-zinc-500" />
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{payment.method}</span>
                        </div>
                      </ActionTableCell>

                      <ActionTableCell className="text-right">
                        <span className="text-base font-black text-white tracking-tight">
                          ${payment.amount}
                        </span>
                      </ActionTableCell>

                      <ActionTableCell className="text-center">
                        <div className={cn(
                          "mx-auto flex items-center justify-center size-8 rounded-full ring-2 ring-white/5",
                          sc.bg
                        )}>
                          <StatusIcon className={cn("size-4", sc.color)} />
                        </div>
                      </ActionTableCell>
                    </motion.tr>
                  )
                })
              )}
            </AnimatePresence>
          </ActionTableBody>
        </ActionTable>
      </ActionTableRoot>

      <div className="pt-4 mt-auto border-t border-white/5 flex items-center justify-between">
         <p className="text-[11px] font-semibold text-zinc-500 tracking-wider">
            Mostrando {paginatedPayments.length} de {payments.length}
         </p>
         <div className="flex gap-2">
            <Button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline" size="sm" className="rounded-2xl h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold disabled:opacity-30">
               Anterior
            </Button>
            <Button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              variant="outline" size="sm" className="rounded-2xl h-9 px-4 border-white/5 bg-white/5 hover:bg-white/10 text-xs font-bold disabled:opacity-30">
               Siguiente
            </Button>
         </div>
      </div>
    </div>
  )
}
