"use client"

import * as React from "react"
import { CreditCard, Calendar } from "lucide-react"
import { ModalPrimitive } from "@/components/shared/modal-primitive"
import { SelectPrimitive } from "@/components/shared/select-primitive"
import { ActionButton } from "@/components/shared/action-button"
import { Button } from "@workspace/ui/components/button"

export interface RenewMembershipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  athleteName: string
}

const PLANS = [
  { label: "CrossFit Ilimitado ($60.00)", value: "unlimited", price: 60 },
  { label: "CrossFit 3x Semana ($45.00)", value: "3x_week", price: 45 },
  { label: "Open Box Mensual ($40.00)", value: "open_box", price: 40 },
]

const METHODS = [
  { label: "Efectivo", value: "cash" },
  { label: "Tarjeta de Crédito / Débito", value: "card" },
  { label: "Transferencia Bancaria", value: "transfer" },
]

export function RenewMembershipModal({ open, onOpenChange, athleteName }: RenewMembershipModalProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<string>(PLANS[0]?.value || "unlimited")
  const [selectedMethod, setSelectedMethod] = React.useState<string>(METHODS[0]?.value || "cash")

  const activePlanPrice = PLANS.find(p => p.value === selectedPlan)?.price || 0

  return (
    <ModalPrimitive
      open={open}
      onOpenChange={onOpenChange}
      title="Renovar Membresía"
      description={`Configura la nueva facturación para ${athleteName}. El acceso se restablacerá inmediatamente tras procesar el pago.`}
      icon={CreditCard}
      trigger={<span className="hidden"></span>} // Triggered manually via state from parent
    >
      <div className="flex flex-col gap-6">
         {/* Resumen del Atleta */}
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
               <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  Plan a renovar
               </label>
               <SelectPrimitive 
                  options={PLANS} 
                  value={selectedPlan} 
                  onValueChange={setSelectedPlan} 
                  icon={Calendar}
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-black uppercase tracking-widest text-zinc-500">
                  Método de pago
               </label>
               <SelectPrimitive 
                  options={METHODS} 
                  value={selectedMethod} 
                  onValueChange={setSelectedMethod} 
                  icon={CreditCard}
               />
            </div>
         </div>

         {/* Resumen de cobro (Fixed values per user request) */}
         <div className="p-6 rounded-[24px] bg-[#131315]/80 border border-white/5 space-y-4">
            <div className="flex items-center justify-between text-sm font-semibold text-zinc-400">
               <span>Subtotal</span>
               <span className="text-white">${activePlanPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold text-zinc-400">
               <span>Impuestos (0%)</span>
               <span className="text-white">$0.00</span>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div className="flex items-end justify-between">
               <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Total a Pagar</span>
               <span className="text-4xl font-bold text-[#5e5ce6]">${activePlanPrice.toFixed(2)}</span>
            </div>
         </div>

         {/* Actions */}
         <div className="flex gap-4 pt-2">
            <Button 
               variant="ghost" 
               onClick={() => onOpenChange(false)}
               className="flex-1 h-12 rounded-2xl bg-zinc-900 border border-white/5 font-bold text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            >
               Cancelar
            </Button>
            <ActionButton 
               label={`Cobrar $${activePlanPrice.toFixed(2)}`} 
               onClick={() => {
                 onOpenChange(false)
                 // In real logic, triggering a success toast here
               }}
               className="flex-1"
            />
         </div>
      </div>
    </ModalPrimitive>
  )
}
