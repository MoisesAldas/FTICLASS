"use client"

import * as React from "react"
import { toast } from "sonner"
import { ActionButton } from "../shared/action-button"
import { AddAthleteForm } from "./add-athlete-form"

import { ModalPrimitive } from "../shared/modal-primitive"

export function AddAthleteModal() {
  const [open, setOpen] = React.useState(false)

  const handleSuccess = () => {
    setOpen(false)
    toast.success("Atleta registrado", {
      description: "El nuevo miembro ya puede acceder al Box.",
      className: "rounded-[32px] border-white/5 bg-zinc-950 text-white font-semibold text-xs backdrop-blur-3xl",
    })
  }

  return (
    <ModalPrimitive 
      open={open} 
      onOpenChange={setOpen}
      trigger={<ActionButton label="Vincular atleta" />}
      title="Nuevo atleta"
      description="Registre un nuevo miembro en el Box. Todos los campos marcados son obligatorios para el acceso elite."
      maxWidth="sm:max-w-4xl"
    >
      <AddAthleteForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
    </ModalPrimitive>
  )
}
