// ─────────────────────────────────────────────────────────────────────────────
// Service: payments & memberships
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Payment,
  AthleteMembership,
  MembershipPlan,
  PaymentMethod,
} from '@/lib/supabase/types'

// ── Membership Plans ─────────────────────────────────────────────────────────

export async function getMembershipPlans(
  client: SupabaseClient,
  gymId: string
): Promise<MembershipPlan[]> {
  const { data, error } = await client
    .from('membership_plans')
    .select('*')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) throw error
  return data as MembershipPlan[]
}

export interface CreateMembershipPlanInput {
  name: string
  price: number
  billing_cycle: 'monthly' | 'quarterly' | 'annual'
  description?: string
}

export async function createMembershipPlan(
  client: SupabaseClient,
  gymId: string,
  input: CreateMembershipPlanInput
): Promise<MembershipPlan> {
  const { data, error } = await client
    .from('membership_plans')
    .insert({ gym_id: gymId, ...input })
    .select('*')
    .single()

  if (error) throw error
  return data as MembershipPlan
}

// ── Athlete Memberships ──────────────────────────────────────────────────────

export async function getAthleteMemberships(
  client: SupabaseClient,
  gymId: string,
  athleteId?: string
): Promise<AthleteMembership[]> {
  let query = client
    .from('athlete_memberships')
    .select(`
      *,
      membership_plans(id, name, price, billing_cycle),
      athletes(id, profiles(full_name, avatar_url))
    `)
    .eq('gym_id', gymId)
    .order('end_date', { ascending: false })

  if (athleteId) {
    query = query.eq('athlete_id', athleteId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as AthleteMembership[]
}

export interface AssignMembershipInput {
  athlete_id: string
  membership_plan_id: string
  start_date: string
  end_date: string
  auto_renew?: boolean
}

export async function assignMembership(
  client: SupabaseClient,
  gymId: string,
  input: AssignMembershipInput
): Promise<AthleteMembership> {
  const { data, error } = await client
    .from('athlete_memberships')
    .insert({ gym_id: gymId, status: 'active', ...input })
    .select('*, membership_plans(id, name, price)')
    .single()

  if (error) throw error
  return data as AthleteMembership
}

export async function getExpiringMemberships(
  client: SupabaseClient,
  gymId: string,
  daysAhead: number = 7
): Promise<AthleteMembership[]> {
  const today = new Date()
  const future = new Date(today)
  future.setDate(future.getDate() + daysAhead)

  const { data, error } = await client
    .from('athlete_memberships')
    .select('*, athletes(id, profiles(full_name, email)), membership_plans(name)')
    .eq('gym_id', gymId)
    .eq('status', 'active')
    .lte('end_date', future.toISOString().split('T')[0])
    .gte('end_date', today.toISOString().split('T')[0])
    .order('end_date', { ascending: true })

  if (error) throw error
  return data as AthleteMembership[]
}

// ── Payments ─────────────────────────────────────────────────────────────────

export async function getPayments(
  client: SupabaseClient,
  gymId: string,
  options?: {
    athleteId?: string
    status?: Payment['status']
    month?: string // 'YYYY-MM'
    limit?: number
  }
): Promise<Payment[]> {
  let query = client
    .from('payments')
    .select(`
      *,
      athletes(id, profiles(full_name, avatar_url)),
      athlete_memberships(id, membership_plans(name))
    `)
    .eq('gym_id', gymId)
    .order('created_at', { ascending: false })

  if (options?.athleteId) {
    query = query.eq('athlete_id', options.athleteId)
  }
  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.month) {
    const start = `${options.month}-01`
    const end = `${options.month}-31`
    query = query.gte('created_at', start).lte('created_at', end)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Payment[]
}

export interface RegisterPaymentInput {
  athlete_id: string
  amount: number
  method: PaymentMethod
  athlete_membership_id?: string
  notes?: string
  registered_by?: string
}

/**
 * Registra un pago manual (efectivo / transferencia).
 * Automáticamente marca el pago como 'paid' y actualiza paid_at.
 */
export async function registerPayment(
  client: SupabaseClient,
  gymId: string,
  input: RegisterPaymentInput
): Promise<Payment> {
  const { data, error } = await client
    .from('payments')
    .insert({
      gym_id: gymId,
      status: 'paid',
      paid_at: new Date().toISOString(),
      ...input,
    })
    .select('*, athletes(id, profiles(full_name))')
    .single()

  if (error) throw error
  return data as Payment
}

/**
 * Obtiene el total de ingresos del mes actual.
 */
export async function getMonthlyRevenue(
  client: SupabaseClient,
  gymId: string,
  month?: string // 'YYYY-MM', defaults to current month
): Promise<number> {
  const target = month ?? new Date().toISOString().slice(0, 7)
  const start = `${target}-01`
  const end = `${target}-31`

  const { data, error } = await client
    .from('payments')
    .select('amount')
    .eq('gym_id', gymId)
    .eq('status', 'paid')
    .gte('paid_at', start)
    .lte('paid_at', end)

  if (error) throw error
  return (data ?? []).reduce((sum, p) => sum + (p.amount ?? 0), 0)
}
