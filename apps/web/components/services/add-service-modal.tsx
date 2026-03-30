"use client"

import * as React from "react"
import { LayoutGrid } from "lucide-react"
import { ActionButton } from "../shared/action-button"
import { ModalPrimitive } from "../shared/modal-primitive"
import { ServiceForm } from "./service-form"

export function AddServiceModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <ModalPrimitive 
      open={open} 
      onOpenChange={setOpen}
      trigger={<ActionButton label="Nuevo Servicio" />}
      title="Configurar Servicio"
      description="Defina las reglas de acceso, visibilidad de entrenamiento y automatización de reservas para esta disciplina técnica."
     
      maxWidth="sm:max-w-[800px]"
    >
      <ServiceForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
    </ModalPrimitive>
  )
}
