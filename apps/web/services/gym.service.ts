// ─────────────────────────────────────────────────────────────────────────────
// Service: gym
// Datos del gimnasio, settings y stats del dashboard
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Gym, GymSettings, GymStats } from '@/lib/supabase/types'

/**
 * Obtiene el gym del owner autenticado.
 * El gym_id viene del JWT, así que sin parámetros la RLS ya filtra.
 */
export async function getMyGym(
  client: SupabaseClient,
  gymId: string
): Promise<Gym | null> {
  const { data, error } = await client
    .from('gyms')
    .select('*')
    .eq('id', gymId)
    .single()

  if (error) throw error
  return data as Gym
}

export interface UpdateGymInput {
  name?: string
  phone?: string
  address?: string
  timezone?: string
  logo_url?: string
}

export async function updateGym(
  client: SupabaseClient,
  gymId: string,
  input: UpdateGymInput
): Promise<Gym> {
  const { data, error } = await client
    .from('gyms')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', gymId)
    .select('*')
    .single()

  if (error) throw error
  return data as Gym
}

export async function getGymSettings(
  client: SupabaseClient,
  gymId: string
): Promise<GymSettings | null> {
  const { data, error } = await client
    .from('gym_settings')
    .select('*')
    .eq('gym_id', gymId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data as GymSettings | null
}

export async function upsertGymSettings(
  client: SupabaseClient,
  gymId: string,
  input: Partial<GymSettings>
): Promise<GymSettings> {
  const { data, error } = await client
    .from('gym_settings')
    .upsert({ gym_id: gymId, ...input, updated_at: new Date().toISOString() })
    .select('*')
    .single()

  if (error) throw error
  return data as GymSettings
}

/**
 * Obtiene las estadísticas del dashboard via Edge Function.
 * La Edge Function calcula los agregados del lado del servidor.
 */
export async function getGymStats(
  client: SupabaseClient,
  gymId: string
): Promise<GymStats> {
  const { data, error } = await client.functions.invoke('gym-stats', {
    body: { gym_id: gymId },
  })

  if (error) throw error
  return data as GymStats
}
