"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddScheduleForm } from "./add-schedule-form"

export function AddScheduleModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <ModalPrimitive 
      open={open} 
      onOpenChange={setOpen}
      trigger={<ActionButton label="Nuevo Horario" />}
      title="Nuevo Horario"
      description="Registre un nuevo bloque de tiempo, la descripción del servicio y seleccione su capacidad máxima para aperturar plazas de reserva."
      
      maxWidth="sm:max-w-[720px]"
    >
      <AddScheduleForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
    </ModalPrimitive>
  )
}
