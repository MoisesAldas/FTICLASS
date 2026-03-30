"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddStaffForm } from "./add-staff-form"

export function AddStaffModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <ModalPrimitive
      open={open}
      onOpenChange={setOpen}
      title="Registrar Nuevo Coach"
      description="Ingrese los datos profesionales, de contacto y especialidad técnica del nuevo miembro del equipo operativo."
      trigger={
        <ActionButton 
          icon={<Plus className="size-4 mr-2" />}
          label="Añadir Coach"
          className="rounded-2xl"
        />
      }
      maxWidth="sm:max-w-3xl"
    >
      <AddStaffForm 
        onSuccess={() => setOpen(false)} 
        onCancel={() => setOpen(false)}
      />
    </ModalPrimitive>
  )
}
