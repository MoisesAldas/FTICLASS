"use client"

import { cn } from "@workspace/ui/lib/utils"

const DEFAULT_LABELS = ["L", "M", "X", "J", "V", "S", "D"] as const

/** Porcentaje de uso respecto a la capacidad del día (0–100). */
export type WeekAttendancePoint = {
  dayLabel: string
  utilizationPct: number
}

export type AnalyticsChartProps = {
  /** Serie por día (típicamente 7). Si no se pasa, se usan datos de ejemplo. */
  series?: WeekAttendancePoint[]
}

/** Índice 0 = Lunes … 6 = Domingo (alineado con DEFAULT_LABELS). */
function getCurrentWeekdayIndexMonFirst(): number {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

const EXAMPLE_SERIES: WeekAttendancePoint[] = DEFAULT_LABELS.map((dayLabel, i) => ({
  dayLabel,
  utilizationPct: [42, 68, 55, 88, 72, 48, 61][i] ?? 0,
}))

export function AnalyticsChart({ series: seriesProp }: AnalyticsChartProps) {
  const series = seriesProp?.length ? seriesProp : EXAMPLE_SERIES
  const todayIdx = getCurrentWeekdayIndexMonFirst()

  return (
    <div className="flex h-full flex-col bg-zinc-900/90 border border-white/5 rounded-3xl p-6 md:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold tracking-tight text-white">Asistencia semanal</h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-sm bg-[#5e5ce6]" aria-hidden />
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500">
              Check-ins
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-sm border border-white/15 bg-zinc-700/90"
              aria-hidden
            />
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500">
              Capacidad
            </span>
          </div>
        </div>
      </div>

      {/* Área del gráfico: rejilla + columnas alineadas */}
      <div className="relative min-h-[200px] flex-1">
        {/* Líneas horizontales de referencia (alineadas al alto fijo del track) */}
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 flex h-[160px] flex-col justify-between opacity-[0.08]"
          aria-hidden
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-px w-full bg-white" />
          ))}
        </div>

        <div className="flex h-[160px] gap-1.5 sm:gap-2">
          {series.map((point, i) => {
            const pct = clampPct(point.utilizationPct)
            const isToday = i === todayIdx
            const label = (point.dayLabel || DEFAULT_LABELS[i]) ?? "?"

            return (
              <div key={`${label}-${i}`} className="group/bar flex h-full min-w-0 flex-1 flex-col">
                <div className="relative mx-auto h-full w-full max-w-11">
                  {/* Track = capacidad (100% alto) */}
                  <div className="absolute inset-0 overflow-hidden rounded-t-lg border border-white/10 bg-zinc-800/50">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.14]"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          -45deg,
                          transparent,
                          transparent 4px,
                          rgba(255,255,255,0.06) 4px,
                          rgba(255,255,255,0.06) 8px
                        )`,
                      }}
                    />
                    {/* Relleno: anclado abajo, solo redondeo superior — una sola forma, sin “cápsula flotante” */}
                    <div
                      className={cn(
                        "absolute bottom-0 left-0 right-0 min-h-px rounded-t-md transition-all duration-500 ease-out",
                        isToday
                          ? "bg-linear-to-t from-[#4d4ad5] to-[#5e5ce6]"
                          : "bg-[#5e5ce6]/55"
                      )}
                      style={{
                        height: `${pct}%`,
                        minHeight: pct > 0 ? "4px" : undefined,
                      }}
                    />
                  </div>

                  {/* Tooltip hover */}
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-none transition-opacity duration-150 group-hover/bar:opacity-100">
                    {pct}% cupo
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Etiquetas: mismo flex que las barras para centrar cada letra */}
        <div className="mt-3 flex gap-1.5 sm:gap-2">
          {series.map((point, i) => {
            const label = point.dayLabel || DEFAULT_LABELS[i] || String(i + 1)
            const isToday = i === todayIdx
            return (
              <div key={`lab-${label}-${i}`} className="flex min-w-0 flex-1 justify-center">
                <span
                  className={cn(
                    "text-center text-[10px] font-bold tracking-tight",
                    isToday ? "text-[#c2c1ff]" : "text-zinc-500"
                  )}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
