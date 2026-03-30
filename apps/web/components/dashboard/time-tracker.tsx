"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Pause, Square, Clock } from "lucide-react"

export function TimeTracker() {
  const [time] = React.useState("01:24:08")

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0f1115] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group h-full"
    >
      <div className="absolute inset-0 pointer-events-none opacity-25 group-hover:opacity-35 transition-opacity duration-700">
        <svg className="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M0 100 C 20 0, 50 0, 100 100"
            fill="none"
            stroke="url(#fitclass-swirl)"
            strokeWidth="0.5"
            className="animate-[pulse_10s_infinite]"
          />
          <path
            d="M0 100 C 50 0, 80 0, 100 100"
            fill="none"
            stroke="url(#fitclass-swirl)"
            strokeWidth="0.5"
            className="animate-[pulse_15s_infinite] delay-500"
          />
          <defs>
            <linearGradient id="fitclass-swirl" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5e5ce6" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between min-h-[200px]">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="size-4 text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            Cronómetro WOD
          </span>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 py-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-widest mb-8 tabular-nums">
            {time}
          </h2>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="size-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
            >
              <Pause className="size-5 text-white" fill="currentColor" />
            </button>
            <button
              type="button"
              className="size-12 rounded-2xl bg-[#5e5ce6] hover:bg-[#4d4ad5] flex items-center justify-center transition-all ring-1 ring-white/10"
            >
              <Square className="size-5 text-white" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
