"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { AthleteKpis } from "@/components/atletas/athlete-kpis"
import { AthleteToolbar } from "@/components/atletas/athlete-toolbar"
import { AthleteTable } from "@/components/atletas/athlete-table"

export default function AtletasPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Atletas</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Administración centralizada de miembros, membresías y estados de salud en Fitclass.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <AthleteToolbar />
        </div>
      </div>

      {/* 2. Table: El listado principal */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Listado de Miembros</h2>
        </div>
        <AthleteTable />
      </section>

      {/* 3. KPIs: Indicadores de rendimiento al final según lo solicitado */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
           <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-1">Indicadores de Rendimiento (KPIs)</h2>
        </div>
        <AthleteKpis />
      </section>
    </div>
  )
}
