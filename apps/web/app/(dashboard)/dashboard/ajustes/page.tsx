"use client"

import * as React from "react"
import { 
  Building2, 
  Receipt, 
  User, 
  ShieldCheck, 
  Trash2,
  LogOut,
  Settings as SettingsIcon
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ActionCard } from "@/components/shared/action-card"
import { Button } from "@workspace/ui/components/button"
import { PhoneInput } from "@/components/shared/phone-input"

const GymSettings = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-white">Mi Gimnasio</h2>
      <p className="text-sm text-zinc-500">Configura la identidad visual y ubicación de tu centro.</p>
    </div>
    <div className="grid gap-6">
      <ActionCard className="p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="size-24 rounded-[32px] bg-zinc-900 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 transition-all group">
             <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#5e5ce6]/20 transition-all">
                <Building2 className="size-5 text-zinc-500 group-hover:text-indigo-400" />
             </div>
             <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Logo</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold">Logo del Gimnasio</h3>
            <p className="text-zinc-500 text-xs">Recomendado: 512x512px. PNG o SVG.</p>
            <Button variant="outline" className="mt-2 h-9 rounded-xl border-white/5 bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">Actualizar Logo</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre del Gimnasio</label>
              <input 
                type="text" 
                defaultValue="FITCLASS EXPERT" 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
           </div>
           <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">WhatsApp de Soporte</label>
              <PhoneInput 
                defaultValue="+593 99 123 4567"
              />
           </div>
           <div className="md:col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Dirección Física</label>
              <input 
                type="text" 
                defaultValue="Av. de la Libertad 452, Ciudad de México" 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
           </div>
        </div>
      </ActionCard>
    </div>
  </div>
)

const BillingSettings = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-white">Facturación</h2>
      <p className="text-sm text-zinc-500">Configura los datos fiscales para las facturas de tus atletas.</p>
    </div>
    <ActionCard className="p-6 space-y-6">
       <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Razón Social</label>
              <input 
                type="text" 
                defaultValue="FitClass Expert S.A. de C.V." 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
          </div>
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">ID Fiscal / RFC</label>
              <input 
                type="text" 
                defaultValue="FIT990823C42" 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
          </div>
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Moneda Principal</label>
              <select className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all appearance-none cursor-pointer">
                 <option value="USD">USD - Dólar Americano</option>
                 <option value="MXN">MXN - Peso Mexicano</option>
                 <option value="EUR">EUR - Euro</option>
              </select>
          </div>
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Prefijo de Factura</label>
              <input 
                type="text" 
                defaultValue="FC-" 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
          </div>
       </div>
    </ActionCard>
  </div>
)

const ProfileSettings = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-white">Mi Perfil</h2>
      <p className="text-sm text-zinc-500">Gestión de tu identidad personal y acceso.</p>
    </div>
    <ActionCard className="p-6 space-y-6">
       <div className="flex items-center gap-6 mb-4">
          <div className="size-20 rounded-full bg-linear-to-br from-[#5e5ce6] to-[#4d4ad5] p-1 flex items-center justify-center">
             <div className="size-full rounded-full bg-[#131315] flex items-center justify-center">
                <User className="size-8 text-zinc-400" />
             </div>
          </div>
          <div className="space-y-1">
             <h3 className="text-white font-bold">Admin Principal</h3>
             <p className="text-zinc-500 text-xs">Dueño del Gimnasio</p>
             <Button variant="ghost" className="h-8 rounded-lg text-indigo-400 text-[11px] font-bold hover:bg-indigo-500/10 px-2 -ml-2">Cambiar avatar</Button>
          </div>
       </div>

       <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nombre Completo</label>
              <input 
                type="text" 
                defaultValue="Erick FitClass" 
                className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all"
              />
          </div>
          <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Teléfono Personal</label>
              <PhoneInput 
                defaultValue="+593 98 765 4321"
              />
          </div>
       </div>
    </ActionCard>
  </div>
)

const SecuritySettings = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-bold tracking-tight text-white">Seguridad & Cuenta</h2>
      <p className="text-sm text-zinc-500">Protege tu acceso y gestiona acciones críticas.</p>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cambio de Contraseña */}
      <ActionCard className="p-6 space-y-6">
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#5e5ce6]" /> Cambio de Contraseña
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Contraseña Actual</label>
                <input type="password" placeholder="••••••••••••" className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                <input type="password" placeholder="Mínimo 12 caracteres" className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all" />
              </div>
              <Button className="w-fit bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl h-10 px-6 transition-all text-xs">Actualizar Contraseña</Button>
            </div>
        </div>
      </ActionCard>

      {/* Actualizar Correo */}
      <ActionCard className="p-6 space-y-6">
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="size-4 text-[#5e5ce6]" /> Email de la Cuenta
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Nuevo Correo Electrónico</label>
                <input type="email" placeholder="fitclass@expert.com" className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Confirmar Contraseña Actual</label>
                <input type="password" placeholder="Por seguridad, ingresa tu contraseña" className="w-full bg-zinc-950 border border-white/5 rounded-2xl h-12 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[#5e5ce6]/35 transition-all" />
              </div>
              <Button className="w-fit bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl h-10 px-6 transition-all text-xs">Actualizar Email</Button>
            </div>
        </div>
      </ActionCard>
    </div>

    <ActionCard className="p-6 border-rose-500/20 bg-rose-500/5 space-y-4">
       <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
             <Trash2 className="size-4" /> Zona de Peligro
          </h3>
          <p className="text-xs text-rose-500/70">Al eliminar tu cuenta, todos los datos de atletas, membresías y pagos se borrarán permanentemente. Esta acción no tiene vuelta atrás.</p>
       </div>
       <Button variant="outline" className="w-fit border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-bold rounded-xl h-10 px-6 transition-all text-xs">Eliminar mi Cuenta Permanentemente</Button>
    </ActionCard>
  </div>
)

const SETTINGS_TABS = [
  { id: "gym", label: "Mi Gimnasio", icon: Building2 },
  { id: "billing", label: "Facturación", icon: Receipt },
  { id: "profile", label: "Mi Cuenta", icon: User },
  { id: "security", label: "Seguridad", icon: ShieldCheck },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("gym")

  return (
    <div className="flex flex-col gap-10">
      {/* Header section - Matched with Atletas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Ajustes</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Configura la identidad de tu centro, datos de facturación y seguridad de tu cuenta en Fitclass.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button className="bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white text-xs font-bold rounded-xl h-11 px-8 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-10 items-start">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          {SETTINGS_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-white/5 text-white ring-1 ring-white/10 shadow-inner" 
                    : "text-zinc-500 hover:bg-white/2 hover:text-zinc-300"
                )}
              >
                <div className="flex items-center gap-4">
                  <tab.icon className={cn("size-5", isActive ? "text-[#5e5ce6]" : "text-zinc-600 group-hover:text-zinc-400")} />
                  <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabBadge"
                    className="size-2 rounded-full bg-[#5e5ce6] shadow-[0_0_12px_rgba(94,92,230,0.8)]" 
                  />
                )}
              </button>
            )
          })}

          <div className="pt-8 mt-8 border-t border-white/5">
             <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-sm">
                <LogOut className="size-5" />
                Cerrar Sesión
             </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:border-l border-white/5 md:pl-12 min-h-[600px]"
          >
            {activeTab === "gym" && <GymSettings />}
            {activeTab === "billing" && <BillingSettings />}
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
