"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LayoutGrid, Info } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Switch } from "@workspace/ui/components/switch"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"
import { toast } from "sonner"

const serviceSchema = z.object({
  name: z.string().min(2, "El nombre del servicio es requerido"),
  autoBooking: z.boolean(),
  viewWorkoutWithoutBooking: z.boolean(),
  viewShiftDetails: z.boolean(),
  multipleBookingsPerDay: z.boolean(),
  allowWithoutActiveMembership: z.boolean(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ServiceForm({ onSuccess, onCancel }: ServiceFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      autoBooking: true,
      viewWorkoutWithoutBooking: false,
      viewShiftDetails: true,
      multipleBookingsPerDay: false,
      allowWithoutActiveMembership: false,
    },
  })

  async function onSubmit(data: ServiceFormValues) {
    setIsSubmitting(true)
    // Simulación de guardado técnico
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Service configuration:", data)
    setIsSubmitting(false)
    toast.success("Servicio configurado", {
      description: `El servicio ${data.name} ha sido actualizado con sus nuevas reglas de acceso.`,
    })
    onSuccess?.()
  }

  const switches = [
    { id: "autoBooking" as const, label: "¿Habilitar reservas automáticamente todos los días?" },
    { id: "viewWorkoutWithoutBooking" as const, label: "¿Permitir a clientes ver el entrenamiento del día sin una reserva?" },
    { id: "viewShiftDetails" as const, label: "¿Permitir a clientes ver los detalles de un turno?" },
    { id: "multipleBookingsPerDay" as const, label: "¿Permitir reservar varios turnos en el mismo día?" },
    { id: "allowWithoutActiveMembership" as const, label: "¿Permitir a clientes el uso del servicio sin una membresía activa?" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <FieldGroup className="gap-6">
        <Field orientation="vertical">
          <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1 uppercase">Nombre del Servicio</FieldLabel>
          <div className="relative">
             <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
             <Input 
                {...register("name")}
                placeholder="Ej. CrossFit" 
                className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 pl-12 transition-all font-medium text-white"
             />
          </div>
          <FieldError errors={[errors.name]} />
        </Field>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 px-1">
             <Info className="size-3.5 text-indigo-500" />
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Reglas y Marcadores de Reserva</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-6 rounded-[24px] bg-zinc-900/30 border border-white/5">
            {switches.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 group">
                <span className="text-zinc-300 text-[13px] font-medium leading-tight group-hover:text-white transition-colors max-w-[240px]">
                  {item.label}
                </span>
                <Switch 
                  checked={watch(item.id)}
                  onCheckedChange={(checked) => setValue(item.id, checked)}
                />
              </div>
            ))}
          </div>
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
          variant="fitclass-primary" 
          disabled={isSubmitting}
          className="rounded-full px-10 h-11 bg-[#5e5ce6] text-white font-bold text-sm shadow-xl shadow-indigo-500/20"
        >
          {isSubmitting ? "Guardando..." : "Guardar Servicio"}
        </Button>
      </div>
    </form>
  )
}
