"use client"

import * as React from "react"
import { Users, UserCheck, UserMinus, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

import { cn } from "@workspace/ui/lib/utils"
import { KpiCard } from "@/components/shared/kpi-card"

import { useSupabase } from "@/hooks/use-supabase"

export function AthleteKpis() {
  const { client, ready, gymId } = useSupabase()
  const [counts, setCounts] = React.useState({ total: 0, active: 0, inactive: 0 })

  const fetchCounts = React.useCallback(async () => {
    if (!client || !gymId) return

    try {
      // 1. Total Atletas
      const { count: total } = await client
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)

      // 2. Atletas Activos
      const { count: active } = await client
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .eq('is_active', true)

      // 3. Inactivos
      const { count: inactive } = await client
        .from('athletes')
        .select('*', { count: 'exact', head: true })
        .eq('gym_id', gymId)
        .eq('is_active', false)

      setCounts({ total: total || 0, active: active || 0, inactive: inactive || 0 })
    } catch (err) {
      console.error("[AthleteKpis] Error fetching counts:", err)
    }
  }, [client, gymId])

  React.useEffect(() => {
    if (ready) {
      fetchCounts()
    }
  }, [ready, fetchCounts])

  const dynamicStats = [
    {
      label: "Total Atletas",
      value: counts.total.toLocaleString(),
      trend: "Total",
      icon: Users,
      variant: "indigo" as const,
    },
    {
      label: "Atletas Activos",
      value: counts.active.toLocaleString(),
      trend: "En box",
      icon: UserCheck,
      variant: "indigo" as const,
    },
    {
      label: "Inactivos",
      value: counts.inactive.toLocaleString(),
      trend: "Revisar",
      icon: UserMinus,
      variant: "rose" as const,
    },
    {
      label: "Por Vencer",
      value: "0",
      trend: "Próximamente",
      icon: AlertCircle,
      variant: "amber" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {dynamicStats.map((stat, i) => (
        <KpiCard
          key={stat.label}
          title={stat.label}
          value={stat.value}
          trend={stat.trend}
          icon={stat.icon}
          variant={stat.variant}
          index={i}
          trendLabel={stat.label === "Por Vencer" ? "Estado actual" : "Métricas totales"}
        />
      ))}
    </div>
  )
}
