"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Loader2, Mail, Phone, LayoutGrid, Award } from "lucide-react"
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
import { PhoneInput } from "../shared/phone-input"

const staffSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  apellidos: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  rol: z.string().min(1, "Debe asignar un rol"),
  especialidad: z.string().min(1, "Especifique un área principal"),
})

import { createCoachAction } from "@/app/(dashboard)/dashboard/staff/actions"

type StaffFormValues = z.infer<typeof staffSchema>

interface AddStaffFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddStaffForm({ onSuccess, onCancel }: AddStaffFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      rol: "",
      especialidad: "",
    },
  })

  async function onSubmit(data: StaffFormValues) {
    setIsSubmitting(true)
    
    try {
      const result = await createCoachAction(data)
      
      if (result.success) {
        toast.success("Coach Registrado", {
          description: `El perfil de ${data.nombre} ya está activo en tu equipo.`,
        })
        onSuccess?.()
      } else {
        toast.error("Error al invitar", {
          description: result.error || "No se pudo enviar la invitación.",
        })
      }
    } catch (err) {
      toast.error("Error crítico", {
        description: "Hubo un problema al procesar la solicitud.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const ROLES_OPTIONS = [
    { label: "Head Coach", value: "head_coach" },
    { label: "Coach Nivel 2", value: "coach_2" },
    { label: "Coach Auxiliar", value: "coach_aux" },
    { label: "Invitado / Especialista", value: "guest" },
  ]

  const ESPECIALIDAD_OPTIONS = [
    { label: "CrossFit General", value: "crossfit" },
    { label: "Halterofilia", value: "weightlifting" },
    { label: "Gimnasia", value: "gymnastics" },
    { label: "Resistencia (Endurance)", value: "endurance" },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        {/* Row 1: Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Nombres</FieldLabel>
            <Input 
              {...register("nombre")}
              placeholder="Ej. Martín" 
              className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 transition-all text-white ${errors.nombre ? "border-red-500/50" : ""}`}
            />
            <FieldError errors={[errors.nombre]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Apellidos</FieldLabel>
            <Input 
              {...register("apellidos")}
              placeholder="Ej. Gómez" 
              className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 transition-all text-white ${errors.apellidos ? "border-red-500/50" : ""}`}
            />
            <FieldError errors={[errors.apellidos]} />
          </Field>
        </div>

        {/* Row 2: Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Correo Electrónico</FieldLabel>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                {...register("email")}
                placeholder="martin@fitclass.com" 
                className={`rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all text-white ${errors.email ? "border-red-500/50" : ""}`}
              />
            </div>
            <FieldError errors={[errors.email]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Teléfono Móvil (Opcional)</FieldLabel>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <PhoneInput 
                  {...field}
                  placeholder="Ej. 099 123 4567"
                  className={errors.telefono ? "border-red-500/50" : ""}
                />
              )}
            />
            <FieldError errors={[errors.telefono]} />
          </Field>
        </div>

        {/* Row 3: Perfil Técnico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Rol Operativo</FieldLabel>
            <SelectPrimitive 
              options={ROLES_OPTIONS}
              placeholder="Seleccione rol"
              value={watch("rol")}
              onValueChange={(val) => setValue("rol", val)}
              icon={Award}
              className={errors.rol ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.rol]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Especialidad Principal</FieldLabel>
            <SelectPrimitive 
              options={ESPECIALIDAD_OPTIONS}
              placeholder="Ej. Halterofilia"
              value={watch("especialidad")}
              onValueChange={(val) => setValue("especialidad", val)}
              icon={LayoutGrid}
              className={errors.especialidad ? "border-red-500/50" : ""}
            />
            <FieldError errors={[errors.especialidad]} />
          </Field>
        </div>
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
          label={isSubmitting ? "Registrando..." : "Registrar Coach"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
