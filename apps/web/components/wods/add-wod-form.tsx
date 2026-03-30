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

import { ActionButton } from "../shared/action-button"
import { SelectPrimitive } from "../shared/select-primitive"

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

export function AddWodForm({ onSuccess, onCancel }: AddWodFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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

  async function onSubmit(data: WodFormValues) {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast.success("Rutina añadida a la librería", {
      description: `El WOD "${data.titulo}" ha sido guardado exitosamente.`,
    })
    onSuccess?.()
  }

  const CATEGORIA_OPTIONS = [
    { label: "AMRAP (As Many Rounds As Possible)", value: "amrap" },
    { label: "EMOM (Every Minute on the Minute)", value: "emom" },
    { label: "For Time", value: "fortime" },
    { label: "Tabata", value: "tabata" },
    { label: "Fuerza / Levantamiento", value: "strength" },
    { label: "Benchmark / Hero WOD", value: "benchmark" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        
        {/* Row 1: Nombre y Formato */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Título / Nombre</FieldLabel>
            <div className="relative">
               <Flame className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
               <Input 
                 {...register("titulo")}
                 placeholder="Ej. Murph / Fran" 
                 className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all text-white ${errors.titulo ? "border-red-500/50" : ""}`}
               />
            </div>
            <FieldError errors={[errors.titulo]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Formato de Entrenamiento</FieldLabel>
            <SelectPrimitive 
              options={CATEGORIA_OPTIONS}
              placeholder="Seleccione modalidad"
              value={watch("categoria")}
              onValueChange={(val) => setValue("categoria", val)}
              icon={LayoutGrid}
              className={errors.categoria ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.categoria]} />
          </Field>
        </div>

        {/* Row 2: Tiempo opcional */}
        <Field orientation="vertical">
           <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Duración Estimada / Time Cap (Opcional)</FieldLabel>
           <div className="relative">
             <Timer className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
             <Input 
               {...register("duracionEstimada")}
               placeholder="Ej. Time Cap 45 min" 
               className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all text-white ${errors.duracionEstimada ? "border-red-500/50" : ""}`}
             />
           </div>
           <FieldError errors={[errors.duracionEstimada]} />
        </Field>

        {/* Row 3: Cuerpo del WOD */}
        <Field orientation="vertical">
           <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Instrucciones del WOD</FieldLabel>
           <textarea 
             {...register("descripcion")}
             placeholder="1 Mile Run\n100 Pull-ups\n200 Push-ups\n300 Squats\n1 Mile Run" 
             className={`w-full rounded-2xl bg-zinc-900/50 border border-white/10 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[160px] p-4 text-sm resize-y transition-all text-white shadow-inner font-mono ${errors.descripcion ? "border-red-500/50" : ""}`}
           />
           <FieldError errors={[errors.descripcion]} />
        </Field>

      </FieldGroup>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="flex-1 rounded-2xl font-bold text-xs hover:text-white transition-colors"
        >
          Cancelar
        </Button>
        <ActionButton 
          type="submit"
          disabled={isSubmitting}
          label={isSubmitting ? "Guardando..." : "Registrar Rutina"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
