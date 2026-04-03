"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddClassForm } from "./add-class-form"

export function AddClassModal({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess?.()
  }

  return (
    <ModalPrimitive 
      open={open} 
      onOpenChange={setOpen}
      trigger={<ActionButton label="Programar Clase" />}
      title="Programar Clase"
      description="Seleccione la disciplina, fecha y bloque horario para abrir una nueva sesión técnica en el calendario."
    
      maxWidth="sm:max-w-[720px]"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <AddClassForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </div>
    </ModalPrimitive>
  )
}
