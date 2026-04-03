"use client"

import * as React from "react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ActionButton } from "../shared/action-button"
import { createAthleteAction } from "@/app/(dashboard)/dashboard/atletas/nuevo/actions"
import { 
  CalendarIcon, 
  Loader2, 
  AtSign, 
  Phone, 
  CreditCard,
  AlertCircle
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { PhoneInput } from "../shared/phone-input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Switch } from "@workspace/ui/components/switch"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldContent,
} from "@workspace/ui/components/field"

const athleteSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z.string().regex(/^\d{10}$/, "La cédula debe tener exactamente 10 dígitos numéricos"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().min(7, "Ingrese un número de teléfono válido"),
  birthDate: z.date({
    required_error: "La fecha de nacimiento es requerida",
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Debe aceptar los términos para continuar"
  }),
})

type AthleteFormValues = z.infer<typeof athleteSchema>

interface AddAthleteFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddAthleteForm({ onSuccess, onCancel }: AddAthleteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      phone: "",
      acceptTerms: false,
    },
  })

  const birthDate = watch("birthDate")

  async function onSubmit(data: AthleteFormValues) {
    setIsSubmitting(true)
    const toastId = toast.loading("Registrando atleta...")
    
    try {
      // 1. Serialización de fecha
      const serializedData = {
        ...data,
        birthDate: data.birthDate instanceof Date 
          ? data.birthDate.toISOString().split('T')[0] 
          : data.birthDate
      }

      console.log("[MODAL] 📡 Enviando:", serializedData)
      const result = await createAthleteAction(serializedData)
      console.log("[MODAL] 🏁 Resultado:", result)

      if (result.error) {
        toast.error("Error al registrar", { 
          id: toastId,
          description: typeof result.error === 'string' ? result.error : "Revisa los datos"
        })
        return
      }

      if (result.success) {
        toast.success("¡Atleta registrado!", { 
          id: toastId,
          description: `Se han creado las credenciales para ${data.firstName}.`
        })
        onSuccess?.()
      }
    } catch (err: any) {
      console.error("[MODAL] ❌ Error fatal:", err)
      toast.error("Error de conexión", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Nombre</FieldLabel>
            <Input 
              {...register("firstName")}
              placeholder="Ej. Juan" 
              className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 px-4 transition-all"
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Apellido</FieldLabel>
            <Input 
              {...register("lastName")}
              placeholder="Ej. Pérez" 
              className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 px-4 transition-all"
            />
            <FieldError errors={[errors.lastName]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Cédula / Pasaporte</FieldLabel>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                {...register("dni")}
                placeholder="Ej. 123456789" 
                className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all"
              />
            </div>
            <FieldError errors={[errors.dni]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Fecha de Nacimiento</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-11 w-full justify-start text-left font-normal rounded-2xl bg-zinc-900/50 border-white/10 hover:bg-zinc-900 px-4",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                  {birthDate ? (
                    format(birthDate, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-white/10 bg-zinc-950 shadow-2xl overflow-hidden" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={(date) => date && setValue("birthDate", date)}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <FieldError errors={[errors.birthDate]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Email</FieldLabel>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                {...register("email")}
                type="email"
                placeholder="email@box.com" 
                className="rounded-2xl bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-11 pl-12 transition-all"
              />
            </div>
            <FieldError errors={[errors.email]} />
          </Field>

          <Field orientation="vertical">
            <FieldLabel className="text-zinc-500 font-semibold text-[11px] tracking-wider px-1">Teléfono</FieldLabel>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput 
                  {...field}
                  placeholder="Ej. 099 123 4567"
                  className="rounded-2xl"
                />
              )}
            />
            <FieldError errors={[errors.phone]} />
          </Field>
        </div>


        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-white/5 gap-4">
            <div className="grid gap-1">
              <label htmlFor="acceptTerms" className="text-sm font-semibold text-white cursor-pointer tracking-tight">
                Acepto términos y condiciones
              </label>
              <p className="text-[11px] text-muted-foreground leading-tight">
                El atleta acepta el reglamento y políticas del Box.
              </p>
            </div>
            <Switch 
              id="acceptTerms"
              checked={watch("acceptTerms")}
              onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
              className="data-[state=checked]:bg-indigo-500"
            />
          </div>
          <FieldError errors={[errors.acceptTerms]} className="mt-2 px-4" />
        </div>
      </FieldGroup>

      <div className="flex gap-3 pt-4 border-t border-white/5">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="flex-1 rounded-2xl font-bold text-xs"
        >
          Cancelar
        </Button>
        <ActionButton 
          type="submit"
          disabled={isSubmitting}
          label={isSubmitting ? "Vinculando..." : "Vincular atleta"}
          icon={isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : undefined}
          className="flex-1 rounded-2xl"
        />
      </div>
    </form>
  )
}
