"use client"

import * as React from "react"
import { motion } from "framer-motion"

export function ProgressGauge() {
  return (
    <div className="bg-zinc-900/90 border border-white/5 rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between">
      <h3 className="text-lg font-black text-white tracking-tight mb-4">
        Objetivo mensual
      </h3>

      <div className="relative flex flex-col items-center justify-center py-4">
        <div className="relative size-48">
          <svg className="size-full -rotate-180" viewBox="0 0 100 50">
            <path
              d="M 10,50 A 40,40 0 1,1 90,50"
              fill="none"
              stroke="white"
              strokeWidth="10"
              strokeDasharray="125.6 125.6"
              className="opacity-5"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.41 }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeInOut" }}
              d="M 10,50 A 40,40 0 1,1 90,50"
              fill="none"
              stroke="url(#fitclass-gauge)"
              strokeWidth="10"
              strokeDasharray="125.6"
              strokeLinecap="round"
            />
            <path
              d="M 10,50 A 40,40 0 1,1 90,50"
              fill="none"
              stroke="rgba(194,193,255,0.15)"
              strokeWidth="10"
              strokeDasharray="2 4"
              className="opacity-30"
            />

            <defs>
              <linearGradient id="fitclass-gauge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c2c1ff" />
                <stop offset="100%" stopColor="#5e5ce6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
            <h2 className="text-4xl font-black text-white tracking-tighter">41%</h2>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
              Mes cerrado
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4 px-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-[#5e5ce6]" />
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-none">
            Logrado
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-[#1e293b]" />
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-none">
            En curso
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-zinc-800" />
          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-none">
            Pendiente
          </span>
        </div>
      </div>
    </div>
  )
}
