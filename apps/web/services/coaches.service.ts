// ─────────────────────────────────────────────────────────────────────────────
// Service: coaches
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Coach } from '@/lib/supabase/types'

export interface CreateCoachInput {
  user_id: string
  specialty?: string
  bio?: string
}

export interface UpdateCoachInput {
  specialty?: string
  bio?: string
  is_active?: boolean
}

export async function getCoaches(
  client: SupabaseClient,
  gymId: string
): Promise<Coach[]> {
  const { data, error } = await client
    .from('coaches')
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Coach[]
}

export async function getCoachById(
  client: SupabaseClient,
  coachId: string
): Promise<Coach | null> {
  const { data, error } = await client
    .from('coaches')
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .eq('id', coachId)
    .single()

  if (error) throw error
  return data as Coach
}

export async function createCoach(
  client: SupabaseClient,
  gymId: string,
  input: CreateCoachInput
): Promise<Coach> {
  const { data, error } = await client
    .from('coaches')
    .insert({ gym_id: gymId, ...input })
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .single()

  if (error) throw error

  await client.from('gym_members').upsert({
    gym_id: gymId,
    user_id: input.user_id,
    role: 'coach',
  })

  return data as Coach
}

export async function updateCoach(
  client: SupabaseClient,
  coachId: string,
  input: UpdateCoachInput
): Promise<Coach> {
  const { data, error } = await client
    .from('coaches')
    .update(input)
    .eq('id', coachId)
    .select('*, profiles(id, full_name, avatar_url, phone, email)')
    .single()

  if (error) throw error
  return data as Coach
}

export async function deactivateCoach(
  client: SupabaseClient,
  coachId: string
): Promise<void> {
  const { error } = await client
    .from('coaches')
    .update({ is_active: false })
    .eq('id', coachId)

  if (error) throw error
}
