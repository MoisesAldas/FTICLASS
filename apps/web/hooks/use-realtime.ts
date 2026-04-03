'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useRealtime
// Suscripción a cambios en tiempo real en una tabla de Supabase.
// Respeta las RLS policies — solo recibe eventos de filas visibles al usuario.
//
// Uso:
//   useRealtime({
//     table: 'class_sessions',
//     filter: `gym_id=eq.${gymId}`,
//     onInsert: (row) => ...,
//     onUpdate: (row) => ...,
//     onDelete: (row) => ...,
//   })
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions<T> {
  /** Cliente Supabase autenticado (de useSupabase) */
  client: SupabaseClient | null
  /** Nombre de la tabla a escuchar */
  table: string
  /** Filtro opcional — ej: `gym_id=eq.${gymId}` */
  filter?: string
  onInsert?: (row: T) => void
  onUpdate?: (row: T) => void
  onDelete?: (row: T) => void
  /** Si false, no suscribe (útil para condicionales) */
  enabled?: boolean
}

export function useRealtime<T = Record<string, unknown>>({
  client,
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
}: UseRealtimeOptions<T>): void {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!client || !enabled) return

    // Canal único por tabla + filtro
    const channelName = filter
      ? `${table}:${filter}`
      : `${table}:all`

    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload

          if (eventType === 'INSERT' && onInsert) {
            onInsert(newRow as T)
          } else if (eventType === 'UPDATE' && onUpdate) {
            onUpdate(newRow as T)
          } else if (eventType === 'DELETE' && onDelete) {
            onDelete(oldRow as T)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      client.removeChannel(channel)
      channelRef.current = null
    }
  }, [client, table, filter, enabled, onInsert, onUpdate, onDelete])
}
