'use server'

/**
 * Server Actions para el flujo de Onboarding
 * Maneja la creación del Gimnasio en Supabase y la sincronización con Clerk
 */

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClerkSupabaseClient } from '@/lib/supabase/client'
import { z } from 'zod'
import { redirect } from 'next/navigation'

const onboardingSchema = z.object({
  name: z.string().min(3, 'El nombre del box debe tener al menos 3 caracteres').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().default('America/Guayaquil'),
})

// ID del Plan "Starter" detectado en la base de datos
const DEFAULT_PLAN_ID = 'b6e668de-2d85-4b1f-9a32-c2dba4036548'

export async function completeOnboardingAction(formData: FormData) {
  const { userId, getToken } = await auth()
  
  if (!userId) {
    throw new Error('No autorizado')
  }

  // 1. Obtener Metadatos del Usuario ANTES para validar campos
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const metadata = clerkUser.publicMetadata
  const isCoach = metadata.role === 'coach'

  // Obtenemos el token de Clerk para Supabase
  const token = await getToken({ template: 'supabase2' })
  if (!token) {
    return { error: 'Error de autenticación con la base de datos.' }
  }

  const supabase = createClerkSupabaseClient(token)

  // 2. Validar inputs
  const validatedFields = onboardingSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    timezone: formData.get('timezone'),
  })

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { name, phone, address, timezone } = validatedFields.data

  // Si es Dueño, el nombre del box ES obligatorio
  if (!isCoach && (!name || name.length < 3)) {
    return { error: { name: ['El nombre del box es obligatorio para dueños'] } }
  }

  try {
    // 1. Obtener Metadatos del Usuario
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    const metadata = clerkUser.publicMetadata
    const isCoach = metadata.role === 'coach'
    const existingGymId = metadata.gym_id as string

    const fullName = `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim()
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
    const avatarUrl = clerkUser.imageUrl

    console.log('--- INICIO ONBOARDING ---')
    console.log('User:', userId, email, 'Role:', isCoach ? 'Coach' : 'Owner')

    // 2. Crear el perfil si no existe (Identity Layer)
    console.log('1. Upserting profile...')
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: fullName || 'Usuario de FITCLASS',
      email: email,
      avatar_url: avatarUrl,
      phone: phone, 
      updated_at: new Date().toISOString(),
    })
    if (profileError) throw profileError

    let gymId = existingGymId

    // 3. Rama de Creación (Solo para Owners)
    if (!isCoach) {
      console.log('2. Inserting NEW gym (Owner Flow)...')
      const { data: gym, error: gymError } = await supabase
        .from('gyms')
        .insert({
          name,
          phone,
          address,
          timezone,
          owner_clerk_id: userId,
          plan_id: DEFAULT_PLAN_ID,
          is_active: true,
        })
        .select('id')
        .single()

      if (gymError) throw gymError
      gymId = gym.id
    }

    // 4. Crear el Gym Member (Owner o Coach)
    console.log(`3. Inserting member role: ${isCoach ? 'coach' : 'gym_owner'}...`)
    const { error: memberError } = await supabase.from('gym_members').upsert({
      gym_id: gymId,
      user_id: userId,
      role: isCoach ? 'coach' : 'gym_owner',
      is_active: true
    })
    if (memberError) throw memberError

    // 5. Si es Coach, crear el registro específico de Coach
    if (isCoach) {
      console.log('4. Registering specialist Coach profile...')
      const { error: coachError } = await supabase.from('coaches').upsert({
        id: userId,
        gym_id: gymId,
        specialty: metadata.specialty as string || 'General',
        role: metadata.operationalRole as string || 'Coach',
        is_active: true
      })
      if (coachError) throw coachError
    }

    // 6. Actualizar Clerk Public Metadata (Fijar gym_id si es nuevo owner)
    if (!isCoach) {
      console.log('5. Finalizing Owner Metadata in Clerk...')
      await client.users.updateUser(userId, {
        publicMetadata: {
          gym_id: gymId,
          role: 'gym_owner',
        },
      })
    }

    console.log('--- ONBOARDING COMPLETADO CON ÉXITO ---')
    return { success: true }
  } catch (error: any) {
    console.error('--- ERROR EN ONBOARDING ---')
    console.error(error)
    return { error: error.message || 'Ocurrió un error inesperado.' }
  }
}
