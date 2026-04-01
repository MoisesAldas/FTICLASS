"use client"

import * as React from "react"
import { ActionCard, ActionCardHeader, ActionCardContent, ActionCardAvatar, ActionCardProgress } from "@/components/shared/action-card"
import { ActionButton } from "@/components/shared/action-button"
import { Crown, AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react"

interface SubscriptionInfo {
  planName: string
  status: "active" | "expired" | "frozen"
  daysRemaining: number
  totalDays: number
  price: string
  nextBillingDate: string
}

interface AthleteSubscriptionCardProps {
  subscription: SubscriptionInfo
  onRenew: () => void
}

export function AthleteSubscriptionCard({ subscription, onRenew }: AthleteSubscriptionCardProps) {
  const isExpired = subscription.status === "expired"
  
  return (
    <ActionCard className="h-full flex flex-col border-white/5">
      <ActionCardHeader className="flex flex-row items-center gap-4">
        <ActionCardAvatar>
          <Crown className="size-6 text-[#5e5ce6]" />
        </ActionCardAvatar>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white tracking-tight">Membresía Actual</h2>
          <p className="text-sm font-medium text-zinc-500">Gestión de facturación y acceso</p>
        </div>
      </ActionCardHeader>
      
      <ActionCardContent className="space-y-6">
        {/* Job Chip Style block for exact info */}
        <div className="flex items-center justify-between p-4 bg-[#131315]/80 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3">
             <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
               {isExpired ? <AlertCircle className="size-5 text-rose-500" /> : <CheckCircle2 className="size-5 text-emerald-500" />}
             </div>
             <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight">{subscription.planName}</span>
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{subscription.price} / MES</span>
             </div>
           </div>
           <div className="text-right">
              <span className="block text-2xl font-black text-white">{subscription.daysRemaining}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Días Restantes</span>
           </div>
        </div>

        {/* Action Card Progress */}
        <ActionCardProgress 
          value={subscription.daysRemaining} 
          max={subscription.totalDays} 
          label="Ciclo de facturación" 
        />
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-semibold text-zinc-400">
           <span>Próximo cobro:</span>
           <span className="text-white font-bold">{subscription.nextBillingDate}</span>
        </div>
      </ActionCardContent>

      <div className="mt-auto px-6 py-4 flex shrink-0 z-10 border-t border-white/5 bg-white/2">
         <ActionButton 
           label="Renovar Membresía" 
           icon={<RefreshCcw className="mr-2 size-4" />}
           onClick={onRenew}
           className="w-full flex-1"
         />
      </div>
    </ActionCard>
  )
}
