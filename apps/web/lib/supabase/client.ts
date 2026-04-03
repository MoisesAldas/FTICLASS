// ─────────────────────────────────────────────────────────────────────────────
// Supabase client factory
// Crea un cliente autenticado con el JWT de Clerk (HS256)
// Se usa desde hooks en componentes client-side
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Crea un cliente Supabase autenticado con un JWT de Clerk.
 * Las RLS policies leen `gym_id` y `role` desde los claims del token.
 *
 * @param clerkToken - Token JWT obtenido con `getToken({ template: 'supabase' })`
 */
export function createClerkSupabaseClient(clerkToken: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
    auth: {
      // Desactivamos Supabase Auth — usamos Clerk como IdP
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

/**
 * Cliente sin autenticación — solo para datos públicos (planes, etc.)
 * No pasa por RLS, solo funciona en tablas con policies públicas.
 */
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
