// ─────────────────────────────────────────────────────────────────────────────
// Service: athletes
// Todas las operaciones de atletas del gimnasio.
// Todas usan el cliente autenticado — RLS filtra por gym_id automáticamente.
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Athlete } from '@/lib/supabase/types'

export interface CreateAthleteInput {
  user_id: string
  birthdate?: string
  emergency_contact?: string
  notes?: string
}

export interface UpdateAthleteInput {
  birthdate?: string
  emergency_contact?: string
  notes?: string
  is_active?: boolean
}

/**
 * Lista todos los atletas del gym con sus perfiles.
 * RLS aplica gym_id automáticamente desde el JWT.
 */
export async function getAthletes(
  client: SupabaseClient,
  gymId: string
): Promise<Athlete[]> {
  const { data, error } = await client
    .from('athletes')
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Athlete[]
}

/**
 * Obtiene un atleta por su ID con perfil completo.
 */
export async function getAthleteById(
  client: SupabaseClient,
  athleteId: string
): Promise<Athlete | null> {
  const { data, error } = await client
    .from('athletes')
    .select(`
      *,
      profiles(id, full_name, avatar_url, phone, email),
      athlete_memberships(
        *,
        membership_plans(id, name, price, billing_cycle)
      )
    `)
    .eq('id', athleteId)
    .single()

  if (error) throw error
  return data as Athlete
}

/**
 * Crea un atleta nuevo y lo agrega como gym_member.
 */
export async function createAthlete(
  client: SupabaseClient,
  gymId: string,
  input: CreateAthleteInput
): Promise<Athlete> {
  const { data, error } = await client
    .from('athletes')
    .insert({ gym_id: gymId, ...input })
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .single()

  if (error) throw error

  // Registrar como gym_member con rol 'athlete'
  await client.from('gym_members').upsert({
    gym_id: gymId,
    user_id: input.user_id,
    role: 'athlete',
  })

  return data as Athlete
}

/**
 * Actualiza los datos de un atleta.
 */
export async function updateAthlete(
  client: SupabaseClient,
  athleteId: string,
  input: UpdateAthleteInput
): Promise<Athlete> {
  const { data, error } = await client
    .from('athletes')
    .update(input)
    .eq('id', athleteId)
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .single()

  if (error) throw error
  return data as Athlete
}

/**
 * Desactiva un atleta (soft delete).
 */
export async function deactivateAthlete(
  client: SupabaseClient,
  athleteId: string
): Promise<void> {
  const { error } = await client
    .from('athletes')
    .update({ is_active: false })
    .eq('id', athleteId)

  if (error) throw error
}

/**
 * Busca atletas por nombre (busca en profiles.full_name).
 */
export async function searchAthletes(
  client: SupabaseClient,
  gymId: string,
  query: string
): Promise<Athlete[]> {
  const { data, error } = await client
    .from('athletes')
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .ilike('profiles.full_name', `%${query}%`)

  if (error) throw error
  return data as Athlete[]
}
