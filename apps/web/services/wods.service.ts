// ─────────────────────────────────────────────────────────────────────────────
// Service: wods
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Wod, WodMovement } from '@/lib/supabase/types'

export interface CreateWodInput {
  title: string
  description?: string
  movements?: WodMovement[]
  date?: string
  is_published?: boolean
  created_by?: string
}

export async function getWods(
  client: SupabaseClient,
  gymId: string,
  options?: { publishedOnly?: boolean; limit?: number }
): Promise<Wod[]> {
  let query = client
    .from('wods')
    .select('*')
    .eq('gym_id', gymId)
    .order('date', { ascending: false })

  if (options?.publishedOnly) {
    query = query.eq('is_published', true)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Wod[]
}

export async function getWodById(
  client: SupabaseClient,
  wodId: string
): Promise<Wod | null> {
  const { data, error } = await client
    .from('wods')
    .select('*')
    .eq('id', wodId)
    .single()

  if (error) throw error
  return data as Wod
}

export async function createWod(
  client: SupabaseClient,
  gymId: string,
  input: CreateWodInput
): Promise<Wod> {
  const { data, error } = await client
    .from('wods')
    .insert({ gym_id: gymId, movements: [], ...input })
    .select('*')
    .single()

  if (error) throw error
  return data as Wod
}

export async function updateWod(
  client: SupabaseClient,
  wodId: string,
  input: Partial<CreateWodInput>
): Promise<Wod> {
  const { data, error } = await client
    .from('wods')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', wodId)
    .select('*')
    .single()

  if (error) throw error
  return data as Wod
}

export async function deleteWod(
  client: SupabaseClient,
  wodId: string
): Promise<void> {
  const { error } = await client.from('wods').delete().eq('id', wodId)
  if (error) throw error
}

export async function getTodayWod(
  client: SupabaseClient,
  gymId: string
): Promise<Wod | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await client
    .from('wods')
    .select('*')
    .eq('gym_id', gymId)
    .eq('date', today)
    .eq('is_published', true)
    .maybeSingle()

  if (error) throw error
  return data as Wod | null
}
