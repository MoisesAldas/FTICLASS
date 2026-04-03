'use client'

import { useUser } from '@clerk/nextjs'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, ArrowRight, Building2, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { completeOnboardingAction } from './actions'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useRouter } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { PhoneInput } from '@/components/shared/phone-input'

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [phoneValue, setPhoneValue] = useState('')

  const isCoach = user?.publicMetadata?.role === 'coach'

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    // Aseguramos que el teléfono con prefijo esté en el FormData
    if (phoneValue) {
      formData.set('phone', phoneValue)
    }

    try {
      const result = await completeOnboardingAction(formData)
      if (result?.error) {
        // Manejo de errores específicos de Zod o backend
        const errorMsg = typeof result.error === 'string' 
          ? result.error 
          : "Revisa los campos obligatorios."
        alert(errorMsg)
        setIsSubmitting(false)
        return
      }

      if (result?.success) {
        // MUY IMPORTANTE: Recargar el usuario y usar window.location 
        // para forzar un refresco de cookies antes de entrar al dashboard.
        await user?.reload()
        window.location.href = '/dashboard'
      }
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-svh bg-[#0a0a0c] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-10%] right-[-10%] size-96 bg-[#5e5ce6] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-[#5e5ce6] rounded-full blur-[120px] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-zinc-950 border border-white/5 shadow-2xl rounded-[32px] p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="size-16 rounded-2xl bg-[#5e5ce6] flex items-center justify-center mb-6 shadow-lg shadow-[#5e5ce6]/20"
          >
            {isCoach ? <CheckCircle2 className="size-8 text-white" /> : <Dumbbell className="size-8 text-white" />}
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            {isCoach ? "¡Bienvenido al Equipo!" : "Configura tu Box"}
          </h1>
          <p className="text-zinc-500 mt-2 max-w-sm text-balance">
            Hola, <span className="text-white font-bold">{user?.firstName}</span>. {isCoach ? "Completa tu perfil profesional para empezar en el box." : "Completa la información inicial para crear tu gimnasio en FITCLASS."}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!isCoach && (
              <div className="space-y-2 group">
                <label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-[#5e5ce6]">
                  Nombre del Box / Gimnasio
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 pointer-events-none group-focus-within:text-[#5e5ce6] transition-colors" />
                  <Input
                    name="name"
                    required
                    placeholder="Ej: Crossfit Iron Core"
                    className="bg-zinc-900/40 border-white/5 rounded-2xl h-14 pl-12 text-white placeholder:text-zinc-700 focus:ring-[#5e5ce6]/30 transition-all font-medium border-solid"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 group">
                <label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-[#5e5ce6]">
                  Tu Teléfono
                </label>
                <div className="relative">
                  <PhoneInput
                    value={phoneValue}
                    onValueChange={setPhoneValue}
                    placeholder="099 123 4567"
                    className="h-14"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-[#5e5ce6]">
                  Zona Horaria
                </label>
                <div className="relative">
                  <Input
                    name="timezone"
                    defaultValue="America/Guayaquil"
                    readOnly
                    className="bg-zinc-800/20 border-white/5 rounded-2xl h-14 text-white opacity-50 cursor-not-allowed border-solid"
                  />
                </div>
              </div>
            </div>

            {!isCoach && (
              <div className="space-y-2 group">
                <label className="text-zinc-400 font-black text-[10px] uppercase tracking-widest pl-1 block transition-colors group-focus-within:text-[#5e5ce6]">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 pointer-events-none" />
                  <Input
                    name="address"
                    placeholder="Dirección del gimnasio"
                    className="bg-zinc-900/40 border-white/5 rounded-2xl h-14 pl-12 text-white placeholder:text-zinc-700 focus:ring-[#5e5ce6]/30 transition-all border-solid"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full h-14 rounded-2xl bg-[#5e5ce6] hover:bg-[#4d4bbd] text-white font-black text-base shadow-xl shadow-[#5e5ce6]/20 transition-all group overflow-hidden relative border-none cursor-pointer",
                isSubmitting && "bg-zinc-800"
              )}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Configurando...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <span>{isCoach ? "Completar Perfil" : "Finalizar Configuración"}</span>
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-4 opacity-50">
          <div className="flex items-center gap-1.5 grayscale">
             <CheckCircle2 className="size-4 text-[#5e5ce6]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Box Registrado</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-30">
             <CheckCircle2 className="size-4 text-[#5e5ce6]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SaaS Activado</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
