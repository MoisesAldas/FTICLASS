"use client"

import * as React from "react"
import { Users, UserCheck, UserMinus, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"
import { KpiCard } from "@/components/shared/kpi-card"

const stats = [
  {
    label: "Total Atletas",
    value: "1,248",
    trend: "+12%",
    icon: Users,
    variant: "indigo" as const,
  },
  {
    label: "Atletas Activos",
    value: "842",
    trend: "+5%",
    icon: UserCheck,
    variant: "indigo" as const,
  },
  {
    label: "Inactivos",
    value: "394",
    trend: "-2%",
    icon: UserMinus,
    variant: "rose" as const,
  },
  {
    label: "Por Vencer",
    value: "12",
    trend: "Hoy",
    icon: AlertCircle,
    variant: "amber" as const,
  },
]

export function AthleteKpis() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <KpiCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
          variant={stat.variant}
          index={i}
          trendLabel={stat.label === "Por Vencer" ? "Estado actual" : "vs. mes anterior"}
        />
      ))}
    </div>
  )
}
