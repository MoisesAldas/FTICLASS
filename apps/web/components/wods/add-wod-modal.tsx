"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { ModalPrimitive } from "../shared/modal-primitive"
import { ActionButton } from "../shared/action-button"
import { AddWodForm } from "./add-wod-form"

interface AddWodModalProps {
  onSuccess?: () => void
}

export function AddWodModal({ onSuccess }: AddWodModalProps) {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess?.()
  }

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
          className="rounded-2xl h-10 px-6 font-black uppercase tracking-wider text-[9px] shadow-lg shadow-indigo-500/10 active:scale-95 transition-all font-sans"
        />
      }
      maxWidth="sm:max-w-3xl"
    >
      <AddWodForm 
        onSuccess={handleSuccess} 
        onCancel={() => setOpen(false)}
      />
    </ModalPrimitive>
  )
}
