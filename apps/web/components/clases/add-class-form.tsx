"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { LayoutGrid, CalendarDays, Award, Clock, Loader2, Flame, Repeat, Sparkles, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
import { useSupabase } from "@/hooks/use-supabase"
import { format, addDays, isBefore, isSameDay, getDay, nextDay as getNextDay } from "date-fns"
import { cn } from "@workspace/ui/lib/utils"

const classSchema = z.object({
  schedule_id: z.string().optional(),
  servicio: z.string().min(1, "Seleccione un servicio"),
  fecha: z.date({ required_error: "La fecha es obligatoria" }),
  horario: z.string().min(1, "Seleccione un horario"),
  entrenador: z.string().min(1, "El entrenador es requerido"),
  wod_id: z.string().optional(),
  capacidad: z.string().optional(),
  is_recurring: z.boolean(),
  repeat_days: z.array(z.number()),
  repeat_until: z.date().optional().nullable(),
})

type ClassFormValues = z.infer<typeof classSchema>

interface AddClassFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const WEEKL_DAYS = [
  { label: "D", value: 0 },
  { label: "L", value: 1 },
  { label: "M", value: 2 },
  { label: "M", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
]

const DAYS_NAME = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export function AddClassForm({ onSuccess, onCancel }: AddClassFormProps) {
  const router = useRouter()
  const { client, gymId } = useSupabase()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const [masterSchedules, setMasterSchedules] = React.useState<any[]>([])
  const [classTypes, setClassTypes] = React.useState<any[]>([])
  const [coaches, setCoaches] = React.useState<any[]>([])
  const [wods, setWods] = React.useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      schedule_id: "",
      servicio: "",
      horario: "",
      entrenador: "",
      wod_id: "",
      capacidad: "20",
      is_recurring: false,
      repeat_days: [],
      repeat_until: null,
    },
  })

  const watchIsRecurring = watch("is_recurring")
  const watchRepeatDays = watch("repeat_days")
  const watchFecha = watch("fecha")

  // Fetch initial data
  React.useEffect(() => {
    async function fetchData() {
      if (!client || !gymId) return
      
      const [schedulesRes, typesRes, coachesRes, wodsRes] = await Promise.all([
        client.from('class_schedules').select('*, class_type:class_types(name)').eq('gym_id', gymId).order('day_of_week').order('start_time'),
        client.from('class_types').select('id, name').eq('gym_id', gymId).eq('is_active', true).order('name'),
        client.from('coaches').select('id, profiles(full_name)').eq('gym_id', gymId).eq('is_active', true),
        client.from('wods').select('id, title').eq('gym_id', gymId).order('date', { ascending: false }).limit(20)
      ])

      if (schedulesRes.data) setMasterSchedules(schedulesRes.data)
      if (typesRes.data) setClassTypes(typesRes.data)
      if (coachesRes.data) setCoaches(coachesRes.data)
      if (wodsRes.data) setWods(wodsRes.data)
    }
    fetchData()
  }, [client, gymId])

  // Logic: When schedule is selected
  const selectedScheduleId = watch("schedule_id")
  React.useEffect(() => {
    if (selectedScheduleId && masterSchedules.length > 0) {
      const sch = masterSchedules.find(s => s.id === selectedScheduleId)
      if (sch) {
        setValue("servicio", sch.class_type_id)
        setValue("entrenador", sch.coach_id)
        setValue("capacidad", sch.capacity.toString())
        setValue("horario", `${sch.start_time}-${sch.end_time}`)
        
        // --- MEJORA INTELIGENTE: AUTO-CALCULAR FECHA ---
        const today = new Date()
        const targetDay = sch.day_of_week // 0-6
        let suggestedDate: Date
        
        if (getDay(today) === targetDay) {
          suggestedDate = today
        } else {
          suggestedDate = getNextDay(today, targetDay as any)
        }
        
        setValue("fecha", suggestedDate)
        setValue("is_recurring", true)
        setValue("repeat_days", [sch.day_of_week])
        
        // Sugerir repetir por defecto por 4 semanas (1 mes)
        setValue("repeat_until", addDays(suggestedDate, 28))
      }
    }
  }, [selectedScheduleId, masterSchedules, setValue])

  async function onSubmit(data: ClassFormValues) {
    if (!client || !gymId) return
    setIsSubmitting(true)

    try {
      const [start, end] = data.horario.split('-')
      const baseSession = {
        gym_id: gymId,
        class_type_id: data.servicio,
        start_time: start,
        end_time: end,
        coach_id: data.entrenador,
        max_capacity: data.capacidad ? parseInt(data.capacidad) : 20,
        notes: data.wod_id ? `WOD: ${data.wod_id}` : null,
      }

      const sessionsToCreate = []
      
      // 1. Initial Session
      sessionsToCreate.push({
        ...baseSession,
        date: format(data.fecha, 'yyyy-MM-dd')
      })

      // 2. Handle Recurrence (Smart Loop)
      if (data.is_recurring && data.repeat_until && data.repeat_days.length > 0) {
        let runnerDate = addDays(data.fecha, 1) // Start from day after
        const endDate = data.repeat_until

        while (isBefore(runnerDate, endDate) || isSameDay(runnerDate, endDate)) {
          const currentDayOfWeek = runnerDate.getDay() // 0-6
          
          if (data.repeat_days.includes(currentDayOfWeek)) {
            sessionsToCreate.push({
              ...baseSession,
              date: format(runnerDate, 'yyyy-MM-dd')
            })
          }
          runnerDate = addDays(runnerDate, 1)
        }
      }

      const { error } = await client
        .from('class_sessions')
        .insert(sessionsToCreate)

      if (error) throw error

      // 3. Forzar actualización de datos en el servidor
      router.refresh()

      toast.success(sessionsToCreate.length > 1 ? "Programación en Serie Lista" : "Clase programada", {
        description: `Se han generado ${sessionsToCreate.length} sesiones en tu calendario.`,
        icon: <CheckCircle2 className="size-4 text-emerald-500" />
      })
      
      // 4. Pequeño delay de 800ms para asegurar indexado en Supabase antes de re-fetch client-side
      await new Promise(r => setTimeout(r, 800))
      
      onSuccess?.()
    } catch (err) {
      console.error("Error scheduling class:", err)
      toast.error("Error al programar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDay = (day: number) => {
    const current = watchRepeatDays
    if (current.includes(day)) {
      setValue("repeat_days", current.filter(d => d !== day))
    } else {
      setValue("repeat_days", [...current, day])
    }
  }

  const MASTER_OPTIONS = masterSchedules.map(s => ({
    label: `${DAYS_NAME[s.day_of_week]} ${s.start_time.substring(0,5)} - ${s.class_type?.name}`,
    value: s.id
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        {/* VINCULADOR MASTER */}
        <div className="p-4 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
           <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-3.5 text-indigo-400" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Automatización Inteligente</h4>
           </div>
           <Field orientation="vertical">
             <SelectPrimitive 
               options={[{ label: "Nuevo Horario Manual", value: "" }, ...MASTER_OPTIONS]}
               placeholder="Basarse en Plan Maestro..."
               value={watch("schedule_id")}
               onValueChange={(val) => setValue("schedule_id", val)}
               icon={CalendarDays}
               className="bg-zinc-950/50 border-indigo-500/20 h-12"
             />
           </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Fecha de Inicio</FieldLabel>
            <DatePicker date={watchFecha} onChange={(date) => date && setValue("fecha", date)} />
            <FieldError errors={[errors.fecha]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Coach</FieldLabel>
            <SelectPrimitive 
              options={coaches.map(c => {
                const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
                return { label: p?.full_name || "Staff", value: c.id }
              })}
              placeholder="Coach Asignado"
              value={watch("entrenador")}
              onValueChange={(val) => setValue("entrenador", val)}
              icon={Award}
            />
            <FieldError errors={[errors.entrenador]} />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Horario (Desde-Hasta)</FieldLabel>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
              <Input 
                {...register("horario")}
                placeholder="07:00:00-08:00:00"
                className="rounded-2xl bg-zinc-900/50 border-white/10 h-11 pl-12 text-[11px] font-mono"
              />
            </div>
            <FieldError errors={[errors.horario]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Disciplina</FieldLabel>
            <SelectPrimitive 
              options={classTypes.map(t => ({ label: t.name, value: t.id }))}
              placeholder="Ej. CrossFit"
              value={watch("servicio")}
              onValueChange={(val) => setValue("servicio", val)}
              icon={LayoutGrid}
            />
          </Field>
        </div>

        {/* CREADOR DE RECURRENCIA DINÁMICO */}
        <div className="p-6 rounded-[2.5rem] bg-zinc-950/40 border border-white/5 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Repeat className="size-4 text-amber-500" />
                 </div>
                 <div className="flex flex-col">
                    <h3 className="text-xs font-black text-white italic uppercase tracking-wider">Programación Recurrente</h3>
                    <p className="text-[10px] text-zinc-500">Repite esta sesión automáticamente</p>
                 </div>
              </div>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setValue("is_recurring", !watchIsRecurring)}
                className={cn(
                  "rounded-full px-4 h-8 text-[10px] font-black uppercase tracking-widest transition-all",
                  watchIsRecurring ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-zinc-800 text-zinc-400"
                )}
              >
                {watchIsRecurring ? "Activo" : "Desactivado"}
              </Button>
           </div>

           {watchIsRecurring && (
             <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-3">
                   <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Días de la semana</span>
                   <div className="flex justify-between gap-1">
                      {WEEKL_DAYS.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={cn(
                            "size-9 rounded-full text-[11px] font-black transition-all border",
                            watchRepeatDays.includes(day.value) 
                              ? "bg-white text-black border-white shadow-lg shadow-white/10 scale-110" 
                              : "bg-zinc-900 text-zinc-600 border-white/5 hover:border-white/20"
                          )}
                        >
                          {day.label}
                        </button>
                      ))}
                   </div>
                </div>

                <Field orientation="vertical">
                   <FieldLabel className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2 px-1">Hasta la fecha</FieldLabel>
                   <DatePicker 
                     date={watch("repeat_until") || undefined} 
                     onChange={(date) => setValue("repeat_until", date)}
                     placeholder="Fecha de fin..."
                   />
                </Field>
             </div>
           )}
        </div>

        <Field orientation="vertical">
           <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">WOD (Opcional)</FieldLabel>
           <SelectPrimitive 
               options={wods.map(w => ({ label: w.title, value: w.id }))}
               placeholder="Vincular WOD de la Pizarra"
               value={watch("wod_id")}
               onValueChange={(val) => setValue("wod_id", val)}
               icon={Flame}
           />
        </Field>
      </FieldGroup>

      <div className="flex gap-3 pt-6">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1 rounded-2xl font-bold text-xs">
          Cancelar
        </Button>
        <ActionButton 
          type="submit"
          disabled={isSubmitting}
          label={isSubmitting ? "Generando..." : "Programar Serie de Clases"}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
