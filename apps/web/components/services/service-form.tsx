"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LayoutGrid, Info } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { useSupabase } from "@/hooks/use-supabase"
import { toast } from "sonner"

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre del servicio es requerido"),
  category: z.string(),
  description: z.string().optional(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ServiceForm({ onSuccess, onCancel }: ServiceFormProps) {
  const { client, gymId } = useSupabase()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category: "General",
      description: "",
    },
  })

  async function onSubmit(data: ServiceFormValues) {
    if (!client || !gymId) {
      toast.error("No se pudo identificar el gimnasio")
      return
    }

    setIsSubmitting(true)
    
    try {
      // 1. Crear el Servicio base
      const { data: newService, error: serviceError } = await client
        .from('services')
        .insert({
          gym_id: gymId,
          name: data.name,
          description: data.description || `Servicio de ${data.name}`,
          is_active: true
        })
        .select('id')
        .single()

      if (serviceError) throw serviceError

      // 2. Crear un tipo de clase por defecto asociado (para facilitar el horario)
      const { error: typeError } = await client
        .from('class_types')
        .insert({
          gym_id: gymId,
          service_id: newService.id,
          name: `${data.name} General`,
          description: `Clase grupal de ${data.name}.`,
          max_capacity: 20,
          duration_minutes: 60,
          color: '#5e5ce6',
          is_active: true
        })

      if (typeError) throw typeError

      toast.success("Servicio creado", {
        description: `El servicio ${data.name} y su tipo de clase general han sido configurados.`,
      })
      
      onSuccess?.()
    } catch (err: any) {
      console.error("Error creating service:", err)
      toast.error("Error al crear el servicio", {
        description: err.message
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup className="gap-6">
        <Field orientation="vertical">
          <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1 uppercase">Nombre del Servicio / Disciplina</FieldLabel>
          <div className="relative">
             <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
             <Input 
                {...register("name")}
                placeholder="Ej. Yoga, HIIT, Boxeo..." 
                className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 pl-12 transition-all font-medium text-white"
             />
          </div>
          <FieldError errors={[errors.name]} />
        </Field>

        <Field orientation="vertical">
          <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1 uppercase">Descripción (Opcional)</FieldLabel>
          <Input 
            {...register("description")}
            placeholder="Breve descripción del servicio..." 
            className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 px-4 transition-all font-medium text-white"
          />
        </Field>

        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-start">
          <Info className="size-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-zinc-400 leading-relaxed italic">
            Al crear este servicio, el sistema generará automáticamente un "Tipo de Clase" con el nombre "<span className="text-indigo-300 font-bold">General</span>" para que pueda empezar a programar turnos de inmediato en la sección de Horarios.
          </p>
        </div>
      </FieldGroup>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="rounded-full px-6 text-zinc-500 hover:text-white transition-colors"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="rounded-full px-10 h-11 bg-[#5e5ce6] hover:bg-[#4a49c0] text-white font-bold text-sm shadow-xl shadow-indigo-500/20"
        >
          {isSubmitting ? "Guardando..." : "Guardar Servicio"}
        </Button>
      </div>
    </form>
  )
}
