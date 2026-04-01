"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  Share2, 
  Dumbbell, 
  CheckCircle2, 
  Calendar,
  User,
  CreditCard,
  QrCode,
  ArrowRight
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import { Badge } from "@workspace/ui/components/badge"

// Mock data for the specific invoice
const INVOICE_DATA = {
  id: "FC-2025-0842",
  date: "24 de Mayo, 2025",
  dueDate: "24 de Junio, 2025",
  status: "Pagado",
  method: "Tarjeta de Crédito (**** 4242)",
  athlete: {
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    id: "ID-99283",
    plan: "Plan Mensual Elite"
  },
  gym: {
    name: "FITCLASS EXPERT",
    address: "Av. de la Libertad 452, Ciudad de México",
    taxId: "RFC: FIT990823C42",
    phone: "+52 55 1234 5678"
  },
  items: [
    {
      description: "Suscripción Mensual Elite - Acceso Total",
      period: "24 de Mayo - 24 de Junio, 2025",
      price: 85.00,
      quantity: 1,
      total: 85.00
    },
    {
      description: "Seguro de Accidentes Deportivo (Anual)",
      period: "Mayo 2025 - Mayo 2026",
      price: 15.00,
      quantity: 1,
      total: 15.00
    }
  ],
  subtotal: 100.00,
  tax: 16.00,
  total: 116.00
}

export default function InvoicePage() {
  const router = useRouter()
  const params = useParams()
  const invoiceId = params.id as string

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Top Navigation & Actions */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="w-fit -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl px-3 transition-all"
        >
          <ChevronLeft className="mr-1.5 size-4" />
          Volver a pagos
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/5 bg-[#131315] hover:bg-white/5 text-xs font-bold rounded-xl h-10 px-4 transition-all">
            <Printer className="mr-2 size-3.5" /> Imprimir
          </Button>
          <Button variant="outline" className="border-white/5 bg-[#131315] hover:bg-white/5 text-xs font-bold rounded-xl h-10 px-4 transition-all">
            <Share2 className="mr-2 size-3.5" /> Compartir
          </Button>
          <Button className="bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-xs font-bold rounded-xl h-10 px-4 transition-all shadow-lg shadow-indigo-500/20">
            <Download className="mr-2 size-3.5" /> Descargar PDF
          </Button>
        </div>
      </div>

      {/* Invoice Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-[#131315] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl relative"
      >
        {/* Status Watermark / Indicator for Mobile */}
        <div className="absolute top-8 right-8 md:hidden">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
            {INVOICE_DATA.status}
          </Badge>
        </div>

        <div className="p-8 md:p-12">
          {/* Header section: Branding & ID */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-[#5e5ce6] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Dumbbell className="size-6 text-white fill-white/20" strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white">FITCLASS</h1>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{INVOICE_DATA.gym.name}</p>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-[240px]">{INVOICE_DATA.gym.address}</p>
                <p className="text-zinc-400 text-xs">{INVOICE_DATA.gym.taxId}</p>
              </div>
            </div>

            <div className="md:text-right space-y-4">
              <div className="hidden md:block">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-4 py-1.5 font-bold text-[11px] uppercase tracking-widest mb-4">
                  {INVOICE_DATA.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Factura No.</p>
                <p className="text-2xl font-mono font-bold text-white">#{INVOICE_DATA.id}</p>
              </div>
              <div className="flex flex-col md:items-end gap-1">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Fecha de emisión</p>
                <p className="text-zinc-200 text-sm font-semibold">{INVOICE_DATA.date}</p>
              </div>
            </div>
          </div>

          {/* Recipient & Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 py-8 border-y border-white/5">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500 mb-2">
                <User className="size-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Facturado a</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-white">{INVOICE_DATA.athlete.name}</p>
                <p className="text-zinc-400 text-sm">{INVOICE_DATA.athlete.email}</p>
                <p className="text-zinc-500 text-xs font-medium">Socio ID: {INVOICE_DATA.athlete.id}</p>
              </div>
            </div>

            <div className="space-y-4 md:text-right">
              <div className="flex items-center md:justify-end gap-2 text-zinc-500 mb-2">
                <CreditCard className="size-3.5" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Método de pago</span>
              </div>
              <div className="space-y-1">
                <p className="text-white font-bold text-sm">{INVOICE_DATA.method}</p>
                <div className="flex items-center md:justify-end gap-2 mt-2">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span className="text-emerald-500 text-xs font-bold uppercase tracking-wide">Transacción exitosa</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <div className="grid grid-cols-12 pb-4 mb-4 border-b border-white/5">
              <div className="col-span-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500">Descripción del servicio</div>
              <div className="col-span-1 text-[10px] uppercase font-bold tracking-widest text-zinc-500 text-center">Cant.</div>
              <div className="col-span-3 text-[10px] uppercase font-bold tracking-widest text-zinc-500 text-right">Monto</div>
            </div>

            <div className="space-y-6">
              {INVOICE_DATA.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 items-center">
                  <div className="col-span-8 flex flex-col gap-1">
                    <p className="text-white font-bold text-sm">{item.description}</p>
                    <p className="text-zinc-500 text-xs font-medium flex items-center gap-1.5">
                      <Calendar className="size-3" /> {item.period}
                    </p>
                  </div>
                  <div className="col-span-1 text-center font-medium text-zinc-400 text-sm">
                    {item.quantity}
                  </div>
                  <div className="col-span-3 text-right font-bold text-white">
                    ${item.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pt-8 border-t border-white/5">
            <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-4 border border-white/5 w-full md:w-auto">
               <div className="size-16 bg-white flex items-center justify-center rounded-xl overflow-hidden p-1">
                  <QrCode className="size-full text-black" />
               </div>
               <div className="space-y-1">
                  <p className="text-white text-xs font-bold">Verificación Online</p>
                  <p className="text-zinc-500 text-[10px] leading-tight max-w-[140px]">Escanea este código para validar la autenticidad de la factura.</p>
               </div>
            </div>

            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium tracking-wide">Subtotal</span>
                <span className="text-white font-bold">${INVOICE_DATA.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-medium tracking-wide">IVA (16%)</span>
                <span className="text-white font-bold">${INVOICE_DATA.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Pagado</span>
                <span className="text-3xl font-black text-[#5e5ce6] italic tracking-tighter">
                  ${INVOICE_DATA.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-[#5e5ce6] px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-white text-sm font-bold tracking-tight">¡Gracias por ser parte de la comunidad FitClass Expert!</p>
           <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <span className="text-[10px] font-black italic tracking-tighter text-white">THE FUTURE OF CROSSFIT</span>
              <ArrowRight className="size-3 text-white" />
           </div>
        </div>
      </motion.div>

      {/* Additional Help / Footer */}
      <div className="max-w-4xl mx-auto mt-12 text-center">
         <p className="text-zinc-500 text-xs">Si tienes dudas sobre este cobro, contacta con soporte en <span className="text-zinc-400 underline cursor-pointer">ayuda@fitclass.com</span></p>
         <p className="text-zinc-600 text-[10px] mt-4 uppercase tracking-[4px]">Powered by FitClass Expert Engine</p>
      </div>
    </div>
  )
}
