"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, LayoutGrid, Timer, Flame } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"

import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { ActionButton } from "../shared/action-button"
import { SelectPrimitive } from "../shared/select-primitive"
import { cn } from "@workspace/ui/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Undo2 } from "lucide-react"

const wodSchema = z.object({
  titulo: z.string().min(2, "Título requerido"),
  categoria: z.string().min(1, "Especifique el formato del WOD"),
  duracionEstimada: z.string().optional(),
  descripcion: z.string().min(10, "La rutina es muy corta"),
})

type WodFormValues = z.infer<typeof wodSchema>

interface AddWodFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

import { useSupabase } from "@/hooks/use-supabase"

export function AddWodForm({ onSuccess, onCancel }: AddWodFormProps) {
  const { client, gymId } = useSupabase()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showCustomCategoria, setShowCustomCategoria] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WodFormValues>({
    resolver: zodResolver(wodSchema),
    defaultValues: {
      titulo: "",
      categoria: "",
      duracionEstimada: "",
      descripcion: "",
    },
  })

  const duracionValue = watch("duracionEstimada")

  async function onSubmit(data: WodFormValues) {
    if (!client || !gymId) {
      toast.error("Error de autenticación", {
        description: "No se pudo identificar el gimnasio activo.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      const { error } = await client
        .from('wods')
        .insert({
          gym_id: gymId,
          title: data.titulo,
          category: data.categoria,
          description: data.descripcion,
          duration: data.duracionEstimada,
          is_published: true,
          date: new Date().toISOString()
        })

      if (error) throw error

      toast.success("Rutina añadida a la librería", {
        description: `El WOD "${data.titulo}" ha sido guardado exitosamente.`,
      })
      onSuccess?.()
    } catch (err) {
      console.error("[AddWodForm] Error saving WOD:", err)
      toast.error("Error al guardar", {
        description: "Hubo un problema al conectar con el servidor.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const CATEGORIA_OPTIONS = [
    { label: "AMRAP (As Many Rounds As Possible)", value: "amrap" },
    { label: "EMOM (Every Minute on the Minute)", value: "emom" },
    { label: "For Time", value: "fortime" },
    { label: "Tabata", value: "tabata" },
    { label: "Fuerza / Levantamiento", value: "strength" },
    { label: "Benchmark / Hero WOD", value: "benchmark" },
    { label: "+ AGREGAR NUEVO FORMATO", value: "custom" },
  ]

  // Time options for picker
  const hours = Array.from({ length: 24 }, (_, i) => ({ label: `${i}h`, value: i.toString() }))
  const minutes = Array.from({ length: 60 }, (_, i) => ({ label: `${i}m`, value: i.toString() }))

  const parseDuration = (val: string) => {
    if (!val) return { h: "0", m: "15" }
    const match = val.match(/(\d+)h (\d+)m/)
    return match ? { h: match[1], m: match[2] } : { h: "0", m: "15" }
  }

  const { h, m } = parseDuration(duracionValue || "")

  const handleTimeChange = (type: "h" | "m", val: string) => {
    const current = parseDuration(duracionValue || "")
    if (type === "h") current.h = val
    if (type === "m") current.m = val
    setValue("duracionEstimada", `${current.h}h ${current.m}m`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        
        {/* Row 1: Nombre, Formato y Duración (3 COLS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase px-1">Título / Nombre</FieldLabel>
            <div className="relative">
               <Flame className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
               <Input 
                 {...register("titulo")}
                 placeholder="Ej. Murph / Fran" 
                 className={`rounded-2xl bg-zinc-900/40 border-white/5 focus:border-indigo-500/30 h-11 pl-12 transition-all text-white placeholder:text-zinc-600 ${errors.titulo ? "border-red-500/50" : ""}`}
               />
            </div>
            <FieldError errors={[errors.titulo]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase px-1">Formato de Entrenamiento</FieldLabel>
            <div className="relative min-h-[46px] min-w-0 -m-1 p-1 overflow-visible">
              <AnimatePresence mode="wait">
                {!showCustomCategoria ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <SelectPrimitive 
                      options={CATEGORIA_OPTIONS}
                      placeholder="Seleccione modalidad"
                      value={watch("categoria")}
                      onValueChange={(val) => {
                        if (val === "custom") {
                          setShowCustomCategoria(true)
                          setValue("categoria", "") // Clear the value to allow custom input
                        } else {
                          setValue("categoria", val)
                        }
                      }}
                      icon={LayoutGrid}
                      className={cn("h-11", errors.categoria ? "border-red-500/50" : "")}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="custom-input"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="relative flex items-center gap-2"
                  >
                    <div className="relative flex-1">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-indigo-400" />
                      <Input 
                        {...register("categoria")}
                        autoFocus
                        placeholder="Escriba el nuevo formato..."
                        className={`rounded-2xl bg-zinc-900/60 border-indigo-500/30 h-11 pl-12 pr-10 text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all ${errors.categoria ? "border-red-500/50" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowCustomCategoria(false)
                          setValue("categoria", "")
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
                        title="Volver a la lista"
                      >
                        <Undo2 className="size-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <FieldError errors={[errors.categoria]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase px-1">Duración (Estimada)</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start rounded-2xl bg-zinc-900/40 border-white/5 h-11 px-4 text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left font-normal",
                    duracionValue && "text-white font-bold"
                  )}
                >
                  <Timer className={cn("size-4 mr-2", duracionValue ? "text-indigo-400" : "text-zinc-500")} />
                  {duracionValue || "Seleccionar duración"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3 bg-zinc-950 border-white/10 rounded-[20px] shadow-2xl z-50">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block px-1">Horas</span>
                    <div className="max-h-[160px] overflow-y-auto pr-1">
                      {hours.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleTimeChange("h", opt.value)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 text-xs rounded-lg transition-all mb-0.5",
                            h === opt.value ? "bg-indigo-500/20 text-indigo-400 font-bold" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 border-l border-white/5 pl-2">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase mb-1 block px-1">Minutos</span>
                    <div className="max-h-[160px] overflow-y-auto pr-1">
                      {minutes.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleTimeChange("m", opt.value)}
                          className={cn(
                            "w-full text-left px-2 py-1.5 text-xs rounded-lg transition-all mb-0.5",
                            m === opt.value ? "bg-indigo-500/20 text-indigo-400 font-bold" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FieldError errors={[errors.duracionEstimada]} />
          </Field>
        </div>

        {/* Row 2: Cuerpo del WOD (FULL WIDTH) */}
        <Field orientation="vertical">
           <div className="flex items-center justify-between px-1 mb-1">
             <FieldLabel className="text-zinc-500 font-bold text-[10px] tracking-widest uppercase">Instrucciones del WOD</FieldLabel>
             <span className="text-[10px] text-zinc-600 font-bold px-2 py-0.5 bg-zinc-900 rounded-lg">Markdown</span>
           </div>
           <textarea 
             {...register("descripcion")}
             placeholder="1 Mile Run\n100 Pull-ups\n200 Push-ups\n300 Squats\n1 Mile Run" 
             className={`w-full rounded-2xl bg-zinc-900/40 border border-white/5 focus:border-indigo-500/30 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 min-h-[180px] p-4 text-sm resize-y transition-all text-white shadow-inner font-mono leading-relaxed placeholder:text-zinc-700 ${errors.descripcion ? "border-red-500/50" : ""}`}
           />
           <FieldError errors={[errors.descripcion]} />
        </Field>

      </FieldGroup>

      <div className="flex gap-3 pt-6 border-t border-white/5">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="flex-1 rounded-2xl font-bold text-xs hover:text-white transition-colors h-12"
        >
          Cancelar
        </Button>
        <ActionButton 
          type="submit"
          disabled={isSubmitting}
          label={isSubmitting ? "Guardando..." : "Registrar Rutina"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl h-12 shadow-lg shadow-indigo-500/10"
        />
      </div>
    </form>
  )
}

