// ─────────────────────────────────────────────────────────────────────────────
// Service: classes
// Gestión de tipos de clase y sesiones programadas
// ─────────────────────────────────────────────────────────────────────────────

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ClassSession, ClassType, ClassEnrollment } from '@/lib/supabase/types'

// ── Class Types ──────────────────────────────────────────────────────────────

export async function getClassTypes(
  client: SupabaseClient,
  gymId: string
): Promise<ClassType[]> {
  const { data, error } = await client
    .from('class_types')
    .select('*, services(id, name)')
    .eq('gym_id', gymId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data as ClassType[]
}

export interface CreateClassTypeInput {
  name: string
  description?: string
  max_capacity: number
  duration_minutes: number
  color?: string
  service_id?: string
}

export async function createClassType(
  client: SupabaseClient,
  gymId: string,
  input: CreateClassTypeInput
): Promise<ClassType> {
  const { data, error } = await client
    .from('class_types')
    .insert({ gym_id: gymId, color: '#5e5ce6', ...input })
    .select('*, services(id, name)')
    .single()

  if (error) throw error
  return data as ClassType
}

// ── Class Sessions ───────────────────────────────────────────────────────────

export interface GetSessionsOptions {
  gymId: string
  date?: string
  dateFrom?: string
  dateTo?: string
  coachId?: string
}

export async function getClassSessions(
  client: SupabaseClient,
  options: GetSessionsOptions
): Promise<ClassSession[]> {
  let query = client
    .from('class_sessions')
    .select(`
      *,
      class_types(id, name, color, duration_minutes, max_capacity),
      coaches(id, profiles(full_name, avatar_url))
    `)
    .eq('gym_id', options.gymId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (options.date) {
    query = query.eq('date', options.date)
  }
  if (options.dateFrom) {
    query = query.gte('date', options.dateFrom)
  }
  if (options.dateTo) {
    query = query.lte('date', options.dateTo)
  }
  if (options.coachId) {
    query = query.eq('coach_id', options.coachId)
  }

  const { data, error } = await query
  if (error) throw error
  return data as ClassSession[]
}

export async function getSessionById(
  client: SupabaseClient,
  sessionId: string
): Promise<ClassSession | null> {
  const { data, error } = await client
    .from('class_sessions')
    .select(`
      *,
      class_types(id, name, color, duration_minutes),
      coaches(id, profiles(full_name, avatar_url)),
      class_enrollments(
        id, status,
        athletes(id, profiles(full_name, avatar_url))
      )
    `)
    .eq('id', sessionId)
    .single()

  if (error) throw error
  return data as ClassSession
}

export interface CreateSessionInput {
  class_type_id: string
  coach_id?: string
  date: string
  start_time: string
  end_time: string
  max_capacity?: number
  notes?: string
}

export async function createClassSession(
  client: SupabaseClient,
  gymId: string,
  input: CreateSessionInput
): Promise<ClassSession> {
  const { data, error } = await client
    .from('class_sessions')
    .insert({ gym_id: gymId, status: 'scheduled', current_enrolled: 0, ...input })
    .select('*, class_types(id, name, color)')
    .single()

  if (error) throw error
  return data as ClassSession
}

export async function updateSessionStatus(
  client: SupabaseClient,
  sessionId: string,
  status: ClassSession['status']
): Promise<void> {
  const { error } = await client
    .from('class_sessions')
    .update({ status })
    .eq('id', sessionId)

  if (error) throw error
}

// ── Enrollments ──────────────────────────────────────────────────────────────

export async function enrollAthlete(
  client: SupabaseClient,
  gymId: string,
  sessionId: string,
  athleteId: string
): Promise<ClassEnrollment> {
  const { data, error } = await client
    .from('class_enrollments')
    .insert({
      gym_id: gymId,
      class_session_id: sessionId,
      athlete_id: athleteId,
      status: 'confirmed',
    })
    .select('*')
    .single()

  if (error) throw error
  return data as ClassEnrollment
}

export async function cancelEnrollment(
  client: SupabaseClient,
  enrollmentId: string
): Promise<void> {
  const { error } = await client
    .from('class_enrollments')
    .update({ status: 'cancelled' })
    .eq('id', enrollmentId)

  if (error) throw error
}

export async function markAttendance(
  client: SupabaseClient,
  enrollmentId: string
): Promise<void> {
  const { error } = await client
    .from('class_enrollments')
    .update({ status: 'attended' })
    .eq('id', enrollmentId)

  if (error) throw error
}

// ── Class Schedules (Recurrence Layout) ───────────────────────────────────────

export interface CreateScheduleInput {
  class_type_id: string
  day_of_week: number // 0-6
  start_time: string
  end_time: string
  capacity: number
  coach_id?: string
}

export async function createClassSchedule(
  client: SupabaseClient,
  gymId: string,
  input: CreateScheduleInput
): Promise<any> {
  const { data, error } = await client
    .from('class_schedules')
    .insert({ gym_id: gymId, ...input })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function getGymSchedules(
  client: SupabaseClient,
  gymId: string
): Promise<any[]> {
  const { data, error } = await client
    .from('class_schedules')
    .select('*, class_types(id, name, color), coaches(id, profiles(full_name))')
    .eq('gym_id', gymId)
    .order('day_of_week')
    .order('start_time')

  if (error) throw error
  return data
}

/**
 * Genera sesiones reales (class_sessions) a partir de los horarios fijos
 * para un rango de fechas.
 */
export async function generateSessionsFromSchedules(
  client: SupabaseClient,
  gymId: string,
  startDate: Date,
  endDate: Date
): Promise<{ created: number; skipped: number }> {
  // 1. Obtener todos los horarios del gimnasio
  const schedules = await getGymSchedules(client, gymId)
  
  // 2. Obtener sesiones existentes para evitar duplicados
  const { data: existingSessions } = await client
    .from('class_sessions')
    .select('date, start_time, class_type_id')
    .eq('gym_id', gymId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])

  const existingMap = new Set(
    existingSessions?.map(s => `${s.date}_${s.start_time}_${s.class_type_id}`) || []
  )

  const sessionsToCreate = []
  const currentDate = new Date(startDate)

  // 3. Iterar por cada día en el rango
  console.log(`🔍 Iniciando bucle desde ${startDate.toDateString()} hasta ${endDate.toDateString()}`)
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay() // 0 (Sun) - 6 (Sat)
    // Usamos una forma más segura de obtener la fecha local YYYY-MM-DD
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    // Buscar horarios que coincidan con este día de la semana
    const activeSchedules = schedules.filter(s => s.day_of_week === dayOfWeek)
    
    if (activeSchedules.length > 0) {
      console.log(`📅 Procesando ${dateStr} (Día: ${dayOfWeek}). Encontrados: ${activeSchedules.length} turnos.`)
    }

    for (const sch of activeSchedules) {
      const key = `${dateStr}_${sch.start_time}_${sch.class_type_id}`
      
      if (!existingMap.has(key)) {
        console.log(`   ✨ Generando sesión: ${sch.start_time} - Disciplina: ${sch.class_type_id}`)
        sessionsToCreate.push({
          gym_id: gymId,
          class_type_id: sch.class_type_id,
          coach_id: sch.coach_id,
          date: dateStr,
          start_time: sch.start_time,
          end_time: sch.end_time,
          max_capacity: sch.capacity,
          status: 'scheduled',
          current_enrolled: 0
        })
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  if (sessionsToCreate.length > 0) {
    const { error } = await client.from('class_sessions').insert(sessionsToCreate)
    if (error) throw error
  }

  return { 
    created: sessionsToCreate.length, 
    skipped: (schedules.length * daysBetween(startDate, endDate)) - sessionsToCreate.length 
  }
}

function daysBetween(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}
