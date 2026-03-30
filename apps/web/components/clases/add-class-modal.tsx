"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddClassForm } from "./add-class-form"

export function AddClassModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <ModalPrimitive 
      open={open} 
      onOpenChange={setOpen}
      trigger={<ActionButton label="Programar Clase" />}
      title="Programar Clase"
      description="Seleccione la disciplina, fecha y bloque horario para abrir una nueva sesión técnica en el calendario."
    
      maxWidth="sm:max-w-[720px]"
    >
      <AddClassForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
    </ModalPrimitive>
  )
}
