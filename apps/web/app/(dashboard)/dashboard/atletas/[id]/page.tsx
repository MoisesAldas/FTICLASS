"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { AthleteHeader } from "@/components/atletas/profile/athlete-header"
import { AthleteSubscriptionCard } from "@/components/atletas/profile/athlete-subscription-card"
import { AthletePaymentHistory } from "@/components/atletas/profile/athlete-payment-history"
import { RenewMembershipModal } from "@/components/atletas/profile/renew-membership-modal"
import { AthleteRecords } from "@/components/atletas/profile/athlete-records"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

// Mock Data para el atleta seleccionado
const MOCK_ATHLETE = {
  id: "ATH-001",
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan.perez@email.com",
  phone: "+34 600 123 456",
  dni: "12345678A",
  status: "active",
  memberSince: "Mar 2023",
  avatar: "https://i.pravatar.cc/150?u=juan",
}

const MOCK_SUBSCRIPTION = {
  planName: "CrossFit Ilimitado",
  status: "active" as const,
  daysRemaining: 12,
  totalDays: 30,
  price: "$60.00",
  nextBillingDate: "12 Abr 2024",
}

const MOCK_PAYMENTS = [
  {
    id: "TXN-001928",
    date: "12 Mar 2024",
    amount: 60.00,
    planName: "CrossFit Ilimitado",
    method: "transfer",
    status: "paid" as const,
  },
  {
    id: "TXN-001811",
    date: "12 Feb 2024",
    amount: 60.00,
    planName: "CrossFit Ilimitado",
    method: "transfer",
    status: "paid" as const,
  },
  {
    id: "TXN-001704",
    date: "12 Ene 2024",
    amount: 60.00,
    planName: "CrossFit Ilimitado",
    method: "card",
    status: "paid" as const,
  },
]

export default function AthleteProfilePage({ params }: { params: { id: string } }) {
  const [isRenewModalOpen, setIsRenewModalOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
       <AthleteHeader athlete={MOCK_ATHLETE} />

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lado Izquierdo: Estado de Cuenta (El más importante) */}
          <div className="lg:col-span-1">
             <AthleteSubscriptionCard 
               subscription={MOCK_SUBSCRIPTION} 
               onRenew={() => setIsRenewModalOpen(true)} 
             />
          </div>

          {/* Lado Derecho: Contenido Dinámico (Pagos / Récords) */}
          <div className="lg:col-span-2 h-full">
             <Tabs defaultValue="payments" className="w-full flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 bg-zinc-950/50 p-1.5 rounded-2xl border border-white/5">
                   <TabsList className="bg-transparent border-none gap-2">
                      <TabsTrigger 
                        value="payments" 
                        className="rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-white text-zinc-500 font-black uppercase tracking-widest text-[10px] px-6 h-9 transition-all font-sans"
                      >
                         Historial Pagos
                      </TabsTrigger>
                      <TabsTrigger 
                        value="records" 
                        className="rounded-xl data-[state=active]:bg-white/5 data-[state=active]:text-white text-zinc-500 font-black uppercase tracking-widest text-[10px] px-6 h-9 transition-all font-sans"
                      >
                         Récords Personales
                      </TabsTrigger>
                   </TabsList>
                </div>

                <TabsContent value="payments" className="mt-0 flex-1">
                   <div className="bg-[#131315]/50 rounded-[32px] p-6 border border-white/5 shadow-inner h-full min-h-[440px]">
                      <AthletePaymentHistory payments={MOCK_PAYMENTS} />
                   </div>
                </TabsContent>

                <TabsContent value="records" className="mt-0 flex-1">
                   <div className="bg-[#131315]/50 rounded-[32px] p-6 border border-white/5 shadow-inner h-full min-h-[440px]">
                      <AthleteRecords />
                   </div>
                </TabsContent>
             </Tabs>
          </div>
       </div>

       {/* Modal Inyectado en el Root */}
       <RenewMembershipModal 
          open={isRenewModalOpen} 
          onOpenChange={setIsRenewModalOpen} 
          athleteName={`${MOCK_ATHLETE.firstName} ${MOCK_ATHLETE.lastName}`} 
       />
    </div>
  )
}
