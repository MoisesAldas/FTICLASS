"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Clock, FileText, CalendarDays, Loader2 } from "lucide-react"
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

const scheduleSchema = z.object({
  dia: z.string().min(1, "El día es requerido"),
  descripcion: z.string().min(3, "La descripción es muy corta"),
  inicio: z.string().min(1, "Hora de inicio requerida"),
  fin: z.string().min(1, "Hora de fin requerida"),
  capacidad: z.string().min(1, "Especifique la capacidad"),
})

type ScheduleFormValues = z.infer<typeof scheduleSchema>

interface AddScheduleFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddScheduleForm({ onSuccess, onCancel }: AddScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dia: "lunes",
      descripcion: "",
      inicio: "",
      fin: "",
      capacidad: "20",
    },
  })

  async function onSubmit(data: ScheduleFormValues) {
    setIsSubmitting(true)
    // Simulación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast.success("Horario guardado", {
      description: `El turno de las ${data.inicio} para el ${data.dia} fue configurado con éxito.`,
    })
    onSuccess?.()
  }

  const DIAS_OPTIONS = [
    { label: "Lunes", value: "lunes" },
    { label: "Martes", value: "martes" },
    { label: "Miércoles", value: "miercoles" },
    { label: "Jueves", value: "jueves" },
    { label: "Viernes", value: "viernes" },
    { label: "Sábado", value: "sabado" },
    { label: "Domingo", value: "domingo" },
  ]

  const TIME_OPTIONS = Array.from({ length: 18 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2) + 5;
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour.toString().padStart(2, "0")}:${minute}`;
    return { label: time, value: time };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Día de la semana</FieldLabel>
            <SelectPrimitive 
              options={DIAS_OPTIONS}
              value={watch("dia")}
              onValueChange={(val) => setValue("dia", val)}
              icon={CalendarDays}
              className={errors.dia ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.dia]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Descripción</FieldLabel>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                {...register("descripcion")}
                placeholder="Ej. Turno Mañana CrossFit" 
                className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all text-white ${errors.descripcion ? "border-red-500/50" : ""}`}
              />
            </div>
            <FieldError errors={[errors.descripcion]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Hora Inicio</FieldLabel>
            <SelectPrimitive 
              options={TIME_OPTIONS}
              placeholder="00:00"
              value={watch("inicio")}
              onValueChange={(val) => setValue("inicio", val)}
              icon={Clock}
              className={errors.inicio ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.inicio]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Hora Fin</FieldLabel>
            <SelectPrimitive 
              options={TIME_OPTIONS}
              placeholder="00:00"
              value={watch("fin")}
              onValueChange={(val) => setValue("fin", val)}
              icon={Clock}
              className={errors.fin ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.fin]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Capacidad Max.</FieldLabel>
            <div className="relative">
              <Input 
                {...register("capacidad")}
                type="number"
                placeholder="Ej. 20"
                className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 px-4 text-center transition-all text-white ${errors.capacidad ? "border-red-500/50" : ""}`}
              />
            </div>
            <FieldError errors={[errors.capacidad]} />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="flex-1 rounded-2xl font-bold text-xs hover:text-white"
        >
          Cancelar
        </Button>
        <ActionButton 
          type="submit"
          disabled={isSubmitting}
          label={isSubmitting ? "Guardando..." : "Guardar turnos"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
