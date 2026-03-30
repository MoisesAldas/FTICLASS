"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LayoutGrid, CalendarDays, Award, Clock, Loader2, Flame } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@workspace/ui/components/field"

import { DatePicker } from "../shared/date-picker"
import { ActionButton } from "../shared/action-button"
import { SelectPrimitive } from "../shared/select-primitive"

const classSchema = z.object({
  servicio: z.string().min(1, "Seleccione un servicio"),
  fecha: z.date({ required_error: "La fecha es obligatoria" }),
  horario: z.string().min(1, "Seleccione un horario base"),
  entrenador: z.string().min(1, "El entrenador es requerido"),
  wod_id: z.string().optional(),
  capacidad: z.string().optional(),
})

type ClassFormValues = z.infer<typeof classSchema>

interface AddClassFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddClassForm({ onSuccess, onCancel }: AddClassFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      servicio: "",
      horario: "",
      entrenador: "",
      wod_id: "",
      capacidad: "",
    },
  })

  async function onSubmit(data: ClassFormValues) {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    toast.success("Clase programada", {
      description: `La sesión técnica ha sido agendada exitosamente en el calendario.`,
    })
    onSuccess?.()
  }

  const SERVICIOS_OPTIONS = [
    { label: "CrossFit", value: "crossfit" },
    { label: "HIIT", value: "hiit" },
    { label: "Weightlifting", value: "weightlifting" },
  ]

  const HORARIOS_OPTIONS = [
    { label: "07:00 - 08:00 (Turno Mañana)", value: "07:00-08:00" },
    { label: "18:00 - 19:00 (Turno Tarde)", value: "18:00-19:00" },
    { label: "19:00 - 20:30 (Avanzados)", value: "19:00-20:30" },
  ]

  const ENTRENADORES_OPTIONS = [
    { label: "Martín Gómez (Head Coach)", value: "martin_gomez" },
    { label: "Sofía López (Coach Nivel 2)", value: "sofia_lopez" },
    { label: "Andrés Ruiz (Coach Auxiliar)", value: "andres_ruiz" },
  ]

  const WODS_OPTIONS = [
    { label: "Murph (Hero WOD)", value: "wod_murph" },
    { label: "Fran (Benchmark)", value: "wod_fran" },
    { label: "Fuerza Absoluta 5x5", value: "wod_fuerza" },
    { label: "Engine Engine (EMOM)", value: "wod_engine" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Servicio Técnico</FieldLabel>
            <SelectPrimitive 
              options={SERVICIOS_OPTIONS}
              placeholder="Seleccione disciplina"
              value={watch("servicio")}
              onValueChange={(val) => setValue("servicio", val)}
              icon={LayoutGrid}
              className={errors.servicio ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.servicio]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Fecha de Sesión</FieldLabel>
            <DatePicker 
              date={watch("fecha")} 
              onChange={(date) => date && setValue("fecha", date)} 
            />
            <FieldError errors={[errors.fecha]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Horario Base</FieldLabel>
            <SelectPrimitive 
              options={HORARIOS_OPTIONS}
              placeholder="Seleccione bloque"
              value={watch("horario")}
              onValueChange={(val) => setValue("horario", val)}
              icon={Clock}
              className={errors.horario ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.horario]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Coach Asignado</FieldLabel>
            <SelectPrimitive 
              options={ENTRENADORES_OPTIONS}
              placeholder="Seleccione Coach de Staff"
              value={watch("entrenador")}
              onValueChange={(val) => setValue("entrenador", val)}
              icon={Award}
              className={errors.entrenador ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.entrenador]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Rutina (WOD)</FieldLabel>
            <SelectPrimitive 
              options={WODS_OPTIONS}
              placeholder="Asignar rutina sugerida (Opcional)"
              value={watch("wod_id")}
              onValueChange={(val) => setValue("wod_id", val)}
              icon={Flame}
            />
            <FieldError errors={[errors.wod_id]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Capacidad Específica (Opcional)</FieldLabel>
            <div className="relative">
              <Input 
                {...register("capacidad")}
                type="number"
                placeholder="Sobrescribe cupos (Ej. 15)"
                className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 px-4 transition-all text-white ${errors.capacidad ? "border-red-500/50" : ""}`}
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
          label={isSubmitting ? "Programando..." : "Programar Clase"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
