"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddWodForm } from "./add-wod-form"

export function AddWodModal() {
  const [open, setOpen] = React.useState(false)

  return (
    <ModalPrimitive
      open={open}
      onOpenChange={setOpen}
      title="Crear Nueva Rutina (WOD)"
      description="Registra la programación de los entrenamientos en la librería maestra para asignarlos posteriormente a las clases diarias."
      trigger={
        <ActionButton 
          icon={<Plus className="size-4 mr-2" />}
          label="Crear WOD"
          className="rounded-2xl"
        />
      }
      maxWidth="sm:max-w-3xl"
    >
      <AddWodForm 
        onSuccess={() => setOpen(false)} 
        onCancel={() => setOpen(false)}
      />
    </ModalPrimitive>
  )
}
