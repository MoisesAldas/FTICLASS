"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Clock, FileText, CalendarDays, Loader2, LayoutGrid, Award } from "lucide-react"
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
import { useSupabase } from "@/hooks/use-supabase"

const scheduleSchema = z.object({
  day_of_week: z.string().min(1, "El día es requerido"),
  name: z.string().min(3, "La descripción es muy corta"),
  class_type_id: z.string().min(1, "El tipo de clase es requerido"),
  coach_id: z.string().min(1, "El coach es requerido"),
  start_time: z.string().min(1, "Hora de inicio requerida"),
  end_time: z.string().min(1, "Hora de fin requerida"),
  capacity: z.string().min(1, "Especifique la capacidad"),
})

type ScheduleFormValues = z.infer<typeof scheduleSchema>

interface AddScheduleFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const DIAS_MAP: Record<string, number> = {
  "domingo": 0, "lunes": 1, "martes": 2, "miercoles": 3, "jueves": 4, "viernes": 5, "sabado": 6
}

export function AddScheduleForm({ onSuccess, onCancel }: AddScheduleFormProps) {
  const { client, gymId } = useSupabase()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [classTypes, setClassTypes] = React.useState<any[]>([])
  const [coaches, setCoaches] = React.useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      day_of_week: "lunes",
      name: "",
      class_type_id: "",
      coach_id: "",
      start_time: "",
      end_time: "",
      capacity: "20",
    },
  })

  // Fetch Class Types & Coaches
  React.useEffect(() => {
    async function fetchData() {
      if (!client || !gymId) return
      
      const [typesRes, coachesRes] = await Promise.all([
        client.from('class_types').select('id, name').eq('gym_id', gymId).eq('is_active', true).order('name'),
        client.from('coaches').select('id, profiles(full_name)').eq('gym_id', gymId).eq('is_active', true)
      ])

      if (typesRes.data) setClassTypes(typesRes.data)
      if (coachesRes.data) setCoaches(coachesRes.data)
    }
    fetchData()
  }, [client, gymId])

  async function onSubmit(data: ScheduleFormValues) {
    if (!client || !gymId) return
    setIsSubmitting(true)

    try {
      const { error } = await client
        .from('class_schedules')
        .insert([{
          gym_id: gymId,
          day_of_week: DIAS_MAP[data.day_of_week],
          name: data.name,
          class_type_id: data.class_type_id,
          coach_id: data.coach_id,
          start_time: data.start_time,
          end_time: data.end_time,
          capacity: parseInt(data.capacity)
        }])

      if (error) throw error

      toast.success("Horario maestro actualizado", {
        description: `El turno ha sido programado con éxito.`,
      })
      onSuccess?.()
    } catch (err) {
      console.error("Error saving schedule:", err)
      toast.error("Error al guardar el horario")
    } finally {
      setIsSubmitting(false)
    }
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

  const TIME_OPTIONS: { label: string; value: string }[] = (Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const time = `${hour.toString().padStart(2, "0")}:${minute}:00`;
    return { label: time.substring(0, 5), value: time };
  }) as { label: string; value: string }[]).filter(t => {
     const h = parseInt(t.value.split(':')[0] || "0");
     return h >= 5 && h <= 23;
  });

  const ENTRENADORES_OPTIONS = coaches.map(c => ({ 
    label: c.profiles?.full_name || "Desconocido", 
    value: c.id 
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Día de la semana</FieldLabel>
            <SelectPrimitive 
              options={DIAS_OPTIONS}
              value={watch("day_of_week")}
              onValueChange={(val) => setValue("day_of_week", val)}
              icon={CalendarDays}
            />
            <FieldError errors={[errors.day_of_week]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Disciplina Principal</FieldLabel>
            <SelectPrimitive 
              options={classTypes.map(t => ({ label: t.name, value: t.id }))}
              placeholder="Seleccionar tipo..."
              value={watch("class_type_id")}
              onValueChange={(val) => setValue("class_type_id", val)}
              icon={LayoutGrid}
            />
            <FieldError errors={[errors.class_type_id]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field orientation="vertical">
                <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Nombre del Turno / Descripción</FieldLabel>
                <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                    {...register("name")}
                    placeholder="Ej. Clase Mañana - 7:00 AM" 
                    className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-[#5e5ce6]/50 h-11 pl-12 transition-all text-white font-medium"
                    />
                </div>
                <FieldError errors={[errors.name]} />
            </Field>

            <Field orientation="vertical">
                <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Coach por Defecto</FieldLabel>
                <SelectPrimitive 
                    options={ENTRENADORES_OPTIONS}
                    placeholder="Seleccione Coach Titular"
                    value={watch("coach_id")}
                    onValueChange={(val) => setValue("coach_id", val)}
                    icon={Award}
                />
                <FieldError errors={[errors.coach_id]} />
            </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Hora Inicio</FieldLabel>
            <SelectPrimitive 
              options={TIME_OPTIONS}
              placeholder="00:00"
              value={watch("start_time")}
              onValueChange={(val) => setValue("start_time", val)}
              icon={Clock}
            />
            <FieldError errors={[errors.start_time]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Hora Fin</FieldLabel>
            <SelectPrimitive 
              options={TIME_OPTIONS}
              placeholder="00:00"
              value={watch("end_time")}
              onValueChange={(val) => setValue("end_time", val)}
              icon={Clock}
            />
            <FieldError errors={[errors.end_time]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Capacidad Max.</FieldLabel>
            <div className="relative">
              <Input 
                {...register("capacity")}
                type="number"
                placeholder="20"
                className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-[#5e5ce6]/50 h-11 px-4 text-center transition-all text-white font-black"
              />
            </div>
            <FieldError errors={[errors.capacity]} />
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
