"use client"

import * as React from "react"
import { LucideIcon, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { Card, CardContent } from "@workspace/ui/components/card"

export interface KpiCardProps {
  title: string
  value: string | number
  trend?: string
  trendLabel?: string
  icon: LucideIcon
  variant?: "indigo" | "emerald" | "rose" | "amber" | "zinc"
  isActive?: boolean
  className?: string
  index?: number
}

const variants = {
  emerald: {
    text: "text-[#c2c1ff]",
    bg: "bg-[#5e5ce6]/10",
    active: "bg-[#5e5ce6] text-white ring-1 ring-white/10 shadow-lg shadow-indigo-500/10",
    hover: "hover:border-[#5e5ce6]/25",
    trend: "bg-[#5e5ce6]/25 text-[#c2c1ff]",
  },
  indigo: {
    text: "text-[#c2c1ff]",
    bg: "bg-[#5e5ce6]/10",
    active:
      "bg-linear-to-br from-[#5e5ce6] to-[#4d4ad5] text-white ring-1 ring-white/15",
    hover: "hover:border-[#5e5ce6]/25",
    trend: "bg-[#5e5ce6]/25 text-[#c2c1ff]",
  },
  rose: {
    text: "text-rose-400",
    bg: "bg-rose-500/10",
    active: "bg-rose-600 text-white",
    hover: "hover:border-rose-500/20",
    trend: "bg-rose-500/20 text-rose-400",
  },
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    active: "bg-amber-600 text-white",
    hover: "hover:border-amber-500/20",
    trend: "bg-amber-500/20 text-amber-400",
  },
  zinc: {
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
    active: "bg-zinc-600 text-white",
    hover: "hover:border-zinc-500/20",
    trend: "bg-zinc-500/20 text-zinc-400",
  },
}

export function KpiCard({
  title,
  value,
  trend,
  trendLabel = "respecto al mes anterior",
  isActive = false,
  variant = "indigo",
  className,
  index = 0,
}: KpiCardProps) {
  const config = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      <Card className={cn(
        "border-white/5 rounded-3xl group transition-all duration-500 relative min-h-[124px] flex flex-col justify-between overflow-hidden",
        isActive ? config.active : "bg-zinc-900/90 hover:bg-zinc-900",
        !isActive && config.hover
      )}>
        <CardContent className="px-4 pt-2 pb-2.5 flex flex-col justify-between h-full gap-0.5">
          <div className="flex justify-between items-start">
            <span className={cn(
              "text-sm font-semibold tracking-tight leading-snug",
              isActive ? "text-white/85" : "text-zinc-500"
            )}>
              {title}
            </span>
            <div className={cn(
              "size-9 rounded-full border flex items-center justify-center transition-all duration-300",
              isActive ? "border-white/20 bg-white/10" : "border-white/10 group-hover:bg-white/5 group-hover:rotate-45"
            )}>
              <ArrowUpRight className={cn("size-4", isActive ? "text-white" : "text-zinc-400")} />
            </div>
          </div>

          <div>
            <h3 className={cn(
              "text-4xl sm:text-5xl font-black tracking-tighter",
              isActive ? "text-white" : "text-white"
            )}>
              {value}
            </h3>

            <div className="flex items-center gap-2.5 flex-wrap">
              {trend && (
                <div className={cn(
                  "px-1.5 py-0.5 rounded-md text-[11px] font-bold flex items-center justify-center tabular-nums",
                  isActive ? "bg-white/20 text-white" : config.trend
                )}>
                  {trend}
                </div>
              )}
              <span className={cn(
                "text-[10px] font-medium tracking-wide",
                isActive ? "text-white/70" : "text-zinc-500"
              )}>
                {trendLabel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
