"use client"

import * as React from "react"
import { DollarSign, Clock, Users, TrendingUp } from "lucide-react"
import { KpiCard } from "@/components/shared/kpi-card"

const stats = [
  {
    label: "Recaudación Mensual",
    value: "$45,280.00",
    trend: "+12.5%",
    icon: DollarSign,
    variant: "indigo" as const,
  },
  {
    label: "Pagos Pendientes",
    value: "18",
    trend: "$810.00",
    icon: Clock,
    variant: "amber" as const,
  },
  {
    label: "Atletas Morosos",
    value: "42",
    trend: "-5%",
    icon: Users,
    variant: "rose" as const,
  },
  {
    label: "Próximas Renovaciones",
    value: "15",
    trend: "7 días",
    icon: TrendingUp,
    variant: "indigo" as const,
  },
]

export function PaymentKpis() {
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
          trendLabel={
            stat.label === "Pagos Pendientes" 
              ? "Monto estimado" 
              : stat.label === "Próximas Renovaciones" 
                ? "Siguiente periodo" 
                : "vs. mes anterior"
          }
        />
      ))}
    </div>
  )
}
