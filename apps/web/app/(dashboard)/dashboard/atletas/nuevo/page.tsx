"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { 
  CalendarIcon, 
  CheckCircle2, 
  ChevronLeft, 
  Loader2, 
  UserPlus, 
  AtSign, 
  Phone, 
  CreditCard,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { Checkbox } from "@workspace/ui/components/checkbox"
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
  dni: z.string().min(5, "Ingrese una cédula o pasaporte válido"),
  email: z.string().email("Correo electrónico no válido"),
  phone: z.string().min(7, "Ingrese un número de teléfono válido"),
  birthDate: z.date({
    required_error: "La fecha de nacimiento es requerida",
  }),
  acceptTerms: z.boolean(),
})

type AthleteFormValues = z.infer<typeof athleteSchema>

export default function NuevoAtletaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
    // Simulación de guardado
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Athlete data:", data)
    setIsSubmitting(false)
    setIsSuccess(true)
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.push("/dashboard")
    }, 3000)
  }

  if (isSuccess) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="rounded-full bg-emerald-500/20 p-6 animate-pulse">
            <CheckCircle2 className="size-16 text-emerald-500" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-white italic uppercase font-heading">¡Atleta Registrado!</h2>
            <p className="text-muted-foreground text-lg max-w-md">
              El perfil ha sido creado exitosamente. Redirigiendo al panel...
            </p>
          </div>
          <Button 
            onClick={() => router.push("/dashboard")}
            variant="outline" 
            className="mt-4 rounded-xl border-white/10 hover:bg-white/5"
          >
            Volver al Inicio
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-white"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black tracking-tight text-white italic uppercase font-heading leading-tight">Nuevo Atleta</h1>
          <p className="text-muted-foreground font-medium">Registra un nuevo miembro en tu Box.</p>
        </div>
      </div>

      <Card className="rounded-3xl border-white/5 bg-[#131315]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-indigo-500/10 p-3">
                <UserPlus className="size-6 text-indigo-400" data-icon="inline-start" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-white uppercase tracking-tight">Información Personal</CardTitle>
                <CardDescription className="text-muted-foreground/80 font-medium">Complete los datos básicos del nuevo atleta.</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <FieldGroup className="gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field orientation="vertical">
                  <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Nombre</FieldLabel>
                  <FieldContent className="relative">
                    <Input 
                      {...register("firstName")}
                      placeholder="Ej. Juan" 
                      className="rounded-lg bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 px-4 transition-all"
                    />
                  </FieldContent>
                  <FieldError errors={[errors.firstName]} />
                </Field>

                <Field orientation="vertical">
                  <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Apellido</FieldLabel>
                  <Input 
                    {...register("lastName")}
                    placeholder="Ej. Pérez" 
                    className="rounded-lg bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 px-4 transition-all"
                  />
                  <FieldError errors={[errors.lastName]} />
                </Field>
              </div>

              <Field orientation="vertical">
                <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Cédula / Pasaporte</FieldLabel>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" data-icon="inline-start" />
                  <Input 
                    {...register("dni")}
                    placeholder="Ej. 123456789" 
                    className="rounded-lg bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 pl-12 transition-all"
                  />
                </div>
                <FieldError errors={[errors.dni]} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field orientation="vertical">
                  <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Correo Electrónico</FieldLabel>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" data-icon="inline-start" />
                    <Input 
                      {...register("email")}
                      type="email"
                      placeholder="juan.perez@email.com" 
                      className="rounded-lg bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 pl-12 transition-all"
                    />
                  </div>
                  <FieldError errors={[errors.email]} />
                </Field>

                <Field orientation="vertical">
                  <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Teléfono</FieldLabel>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" data-icon="inline-start" />
                    <Input 
                      {...register("phone")}
                      placeholder="+34 600 000 000" 
                      className="rounded-lg bg-zinc-900/50 border-white/10 focus:border-indigo-500/50 h-12 pl-12 transition-all"
                    />
                  </div>
                  <FieldError errors={[errors.phone]} />
                </Field>
              </div>

              <Field orientation="vertical">
                <FieldLabel className="text-indigo-200/50 uppercase text-[10px] font-black tracking-[0.3em] px-1">Fecha de Nacimiento</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal rounded-lg bg-zinc-900/50 border-white/10 hover:bg-zinc-900 px-4",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4 text-muted-foreground" data-icon="inline-start" />
                      {birthDate ? (
                        format(birthDate, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 rounded-2xl border-white/10 bg-zinc-950 shadow-2xl overflow-hidden" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={(date) => date && setValue("birthDate", date)}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FieldError errors={[errors.birthDate]} />
              </Field>

              <div className="pt-4 border-t border-white/5">
                <Field className="items-start gap-4">
                  <Checkbox 
                    id="acceptTerms"
                    checked={watch("acceptTerms")}
                    onCheckedChange={(checked) => setValue("acceptTerms", checked === true)}
                    className="mt-1 rounded border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 transition-colors"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="acceptTerms"
                      className="text-sm font-black text-white cursor-pointer select-none uppercase tracking-tight"
                    >
                      Acepto los términos y condiciones de uso.
                    </label>
                    <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 leading-relaxed italic border-l-2 border-indigo-500/30 pl-3 mt-1">
                      <AlertCircle className="size-3 mt-0.5 shrink-0" />
                      Si no acepta los términos y condiciones de uso ahora, el cliente debe aceptarlos después desde su perfil de usuario
                    </p>
                  </div>
                </Field>
                <FieldError errors={[errors.acceptTerms]} />
              </div>
            </FieldGroup>
          </CardContent>

          <CardFooter className="bg-white/[0.02] p-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] text-indigo-200/40 italic font-black uppercase tracking-widest">
              * Todos los campos son obligatorios para el registro inicial.
            </p>
            <div className="flex gap-4 w-full md:w-auto">
              <Button 
                type="button"
                variant="ghost" 
                onClick={() => router.back()}
                className="flex-1 md:flex-none rounded-2xl hover:bg-white/5 px-8 font-black uppercase tracking-widest text-xs"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                variant="fitclass-primary"
                size="lg"
                className="flex-1 md:flex-none px-12 h-12 active:scale-95 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  "Crear Atleta"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
