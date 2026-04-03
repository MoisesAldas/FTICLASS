'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClerkSupabaseClient } from "@/lib/supabase"
import { 
  createClassSchedule, 
  generateSessionsFromSchedules 
} from '@/services/classes.service'
import { revalidatePath } from 'next/cache'

/**
 * Obtiene el cliente de Supabase autenticado con Clerk.
 */
async function getSupabaseClient() {
  const { getToken } = await auth()
  const token = await getToken({ template: 'supabase2' })
  if (!token) throw new Error('No se pudo obtener el token de seguridad')
  return createClerkSupabaseClient(token)
}

/**
 * Obtiene el gym_id de los metadatos de Clerk del usuario.
 */
async function getMyGymId(userId: string) {
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  return user.publicMetadata.gym_id as string
}

/**
 * Guarda un nuevo horario fijo en la plantilla semanal.
 */
export async function saveScheduleAction(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('No autorizado')

  const gymId = await getMyGymId(userId)
  if (!gymId) throw new Error('No tienes un gimnasio asociado')

  const supabase = await getSupabaseClient()
  
  const input = {
    class_type_id: formData.get('class_type_id') as string,
    day_of_week: parseInt(formData.get('day_of_week') as string),
    start_time: formData.get('start_time') as string,
    end_time: formData.get('end_time') as string,
    capacity: parseInt(formData.get('capacity') as string || '20'),
    coach_id: formData.get('coach_id') as string || undefined,
  }

  await createClassSchedule(supabase, gymId, input)
  
  revalidatePath('/dashboard/horarios')
  return { success: true }
}

/**
 * Sincroniza el calendario: Genera sesiones reales a partir de los horarios fijos.
 */
export async function syncCalendarAction(untilDateStr: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('No autorizado')

  console.log("🛠️ Invocando syncCalendarAction desde el servidor...")
  const gymId = await getMyGymId(userId)
  console.log("➡️ Gym ID detectado:", gymId)
  
  if (!gymId) throw new Error('Gimnasio no encontrado')

  const supabase = await getSupabaseClient()
  
  const startDate = new Date()
  const endDate = new Date(untilDateStr)
  console.log(`➡️ Rango de sincronización: ${startDate.toISOString()} hasta ${endDate.toISOString()}`)

  const result = await generateSessionsFromSchedules(
    supabase, 
    gymId, 
    startDate, 
    endDate
  )

  console.log("✅ Resultado final del servicio:", result)

  revalidatePath('/dashboard/horarios')
  revalidatePath('/dashboard/clases')
  
  return { 
    success: true, 
    message: `Se crearon ${result.created} clases nuevas y se omitieron ${result.skipped} duplicadas.` 
  }
}

/**
 * Elimina un horario de la plantilla.
 */
export async function deleteScheduleAction(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('No autorizado')

  const supabase = await getSupabaseClient()
  const { error } = await supabase
    .from('class_schedules')
    .delete()
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/dashboard/horarios')
  return { success: true }
}
