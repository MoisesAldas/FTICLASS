"use client"

import * as React from "react"
import { Plus, Download, Users, CreditCard, Dumbbell, ShieldCheck } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { KpiCard } from "@/components/shared/kpi-card"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"
import { RemindersCard } from "@/components/dashboard/reminders-card"
import { TeamList } from "@/components/dashboard/team-list"
import { ProjectList } from "@/components/dashboard/project-list"
import { ProgressGauge } from "@/components/dashboard/progress-gauge"
import { TimeTracker } from "@/components/dashboard/time-tracker"

const stats = [
  {
    title: "Atletas en el box",
    value: "248",
    trend: "+12%",
    icon: Users,
    variant: "indigo" as const,
    isActive: true,
    trendLabel: "vs. mes anterior",
  },
  {
    title: "Reservas de la semana",
    value: "186",
    trend: "+8%",
    icon: Dumbbell,
    variant: "indigo" as const,
    trendLabel: "vs. semana pasada",
  },
  {
    title: "Ingresos estimados (mes)",
    value: "$42K",
    trend: "+6%",
    icon: CreditCard,
    variant: "indigo" as const,
    trendLabel: "membresías + drop-in",
  },
  {
    title: "Retención 90 días",
    value: "94%",
    trend: "+2%",
    icon: ShieldCheck,
    variant: "indigo" as const,
    trendLabel: "objetivo del box",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Panel</h1>
          <p className="text-zinc-500 text-sm font-medium max-w-xl">
            Vista rápida de tu box Fitclass: ocupación, clases y cobros en un solo lugar.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button className="bg-[#5e5ce6] hover:bg-[#4d4ad5] text-white rounded-2xl h-12 px-6 font-bold text-sm flex items-center gap-2 ring-1 ring-white/10 transition-colors shadow-lg shadow-indigo-500/10">
            <Plus className="size-4" />
            Nuevo atleta
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 rounded-2xl h-12 px-6 font-semibold"
          >
            <Download className="size-4 mr-2 opacity-70" />
            Importar datos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat, i) => (
          <KpiCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            variant={stat.variant}
            isActive={stat.isActive}
            index={i}
            trendLabel={stat.trendLabel}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>

        <div className="lg:col-span-1">
          <RemindersCard />
        </div>

        <div className="lg:col-span-1">
          <ProjectList />
        </div>

        <div className="lg:col-span-2">
          <TeamList />
        </div>

        <div className="lg:col-span-1">
          <ProgressGauge />
        </div>

        <div className="lg:col-span-1">
          <TimeTracker />
        </div>
      </div>
    </div>
  )
}
