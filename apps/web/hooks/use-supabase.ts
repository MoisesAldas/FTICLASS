'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Hook: useSupabase
// Provee un cliente Supabase autenticado con el JWT de Clerk.
// Úsalo en cualquier componente client-side para hacer queries.
//
// Uso:
//   const { client, ready, gymId, role } = useSupabase()
//   const { data } = await client.from('athletes').select('*')
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole } from '@/lib/supabase/types'

interface UseSupabaseReturn {
  /** Cliente Supabase autenticado — null mientras carga el token */
  client: SupabaseClient | null
  /** True cuando el cliente está listo para usar */
  ready: boolean
  /** gym_id del claim JWT de Clerk */
  gymId: string | null
  /** rol del usuario del claim JWT de Clerk */
  role: UserRole | null
  /** Refresca el cliente con un nuevo token (útil tras cambio de rol) */
  refresh: () => Promise<void>
}

export function useSupabase(): UseSupabaseReturn {
  const { getToken, userId, isLoaded } = useAuth()
  const [client, setClient] = useState<SupabaseClient | null>(null)
  const [gymId, setGymId] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [ready, setReady] = useState(false)
  const tokenRef = useRef<string | null>(null)

  const buildClient = useCallback(async () => {
    if (!userId) return

    try {
      const token = await getToken({ template: 'supabase2' })
      if (!token) return

      // Evitar re-render si el token no cambió
      if (token === tokenRef.current) return
      tokenRef.current = token

      // Extraer claims del JWT (base64 decode del payload)
      const payload = JSON.parse(atob(token.split('.')[1]!))
      
      setGymId(payload.gym_id ?? null)
      setRole(payload.user_role as UserRole ?? null)

      setClient(createClerkSupabaseClient(token))
      setReady(true)
    } catch (err) {
      console.error('[useSupabase] Error building client:', err)
    }
  }, [getToken, userId])

  useEffect(() => {
    if (!isLoaded) return
    buildClient()
  }, [isLoaded, buildClient])

  return useMemo(
    () => ({ client, ready, gymId, role, refresh: buildClient }),
    [client, ready, gymId, role, buildClient]
  )
}
