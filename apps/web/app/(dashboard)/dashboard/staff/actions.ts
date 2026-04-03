"use server"

import { clerkClient, auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { createClerkSupabaseClient } from "@/lib/supabase"
import { sendInvitationEmail } from "@/lib/email"

/**
 * Registro DIRECTO de Coach (Modo Atleta).
 * Crea al usuario en Clerk y Supabase de forma atómica para visibilidad instantánea.
 */
export async function createCoachAction(formData: {
  nombre: string
  apellidos: string
  email: string
  rol: string
  especialidad: string
  telefono?: string
}) {
  console.log('[DEBUG] --- INICIO REGISTRO DIRECTO DE COACH ---')
  const { userId, getToken } = await auth()
  
  if (!userId) {
    console.error('[ERROR] No hay userId en la sesión')
    return { success: false, error: "No autorizado" }
  }

  // 1. Obtener Gym ID del Dueño
  const client = await clerkClient()
  const owner = await client.users.getUser(userId)
  const gymId = owner.publicMetadata.gym_id as string

  if (!gymId) {
    return { success: false, error: "No tienes un gimnasio asociado." }
  }

  try {
    // 2. CREACIÓN DIRECTA EN CLERK
    console.log('[DEBUG] 2. Creando usuario en Clerk...')
    
    // Clerk requiere mínimo 8 caracteres. Si el teléfono es corto, generamos una clave aleatoria segura.
    const cleanPhone = formData.telefono?.replace(/\s/g, '') || '';
    const tempPassword = cleanPhone.length >= 8 
      ? cleanPhone 
      : `FitClass${Math.floor(100000 + Math.random() * 900000)}!`;
    
    console.log('[DEBUG] Password temporal generada (cumple requisitos):', tempPassword.length >= 8)

    const newUser = await client.users.createUser({
      emailAddress: [formData.email],
      password: tempPassword,
      firstName: formData.nombre,
      lastName: formData.apellidos,
      publicMetadata: {
        role: "coach",
        gym_id: gymId,
      },
    })
    console.log('[DEBUG] Usuario Clerk creado:', newUser.id)

    // 3. SINCRONIZACIÓN SUPABASE (Token del Dueño)
    const token = await getToken({ template: 'supabase2' })
    if (!token) throw new Error('Error de seguridad (Token)')
    const supabase = createClerkSupabaseClient(token)

    console.log('[DEBUG] 3. Sincronizando tablas Supabase...')
    
    // 3a. Perfil
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: newUser.id,
      full_name: `${formData.nombre} ${formData.apellidos}`,
      email: formData.email,
      phone: formData.telefono,
    })
    if (profileErr) throw profileErr

    // 3b. Membresía de Gimnasio (Rol Coach)
    const { error: memberErr } = await supabase.from('gym_members').insert({
      gym_id: gymId,
      user_id: newUser.id,
      role: 'coach',
    })
    if (memberErr) throw memberErr

    // 3c. Tabla de Coaches
    const { error: coachErr } = await supabase.from('coaches').insert({
      gym_id: gymId,
      user_id: newUser.id,
      specialty: formData.especialidad,
      is_active: true
    })
    if (coachErr) throw coachErr

    // 4. CORREO DE BIENVENIDA CON CREDENCIALES
    console.log('[DEBUG] 4. Enviando invitación profesional...')
    try {
      const { data: gymData } = await supabase.from('gyms').select('name').eq('id', gymId).single()
      const gymName = gymData?.name || 'FITCLASS'

      const emailResult = await sendInvitationEmail({
        to: formData.email,
        name: formData.nombre,
        gymName: gymName,
        tempPassword: tempPassword,
        senderName: `${owner.firstName} ${owner.lastName}`,
      })

      if (!emailResult.success) {
        console.warn('[WARN] Email service finished with warning:', emailResult.error)
      }
    } catch (e) {
      console.warn('[WARN] Error crítico en el flujo de envío de correo:', e)
    }

    console.log('[DEBUG] --- REGISTRO DIRECTO EXITOSO ---')
    revalidatePath("/dashboard/staff")
    return { success: true }

  } catch (error: any) {
    console.error('[ERROR CRÍTICO] createCoachAction:', error)
    
    // Si el error es de Clerk, devolvemos un mensaje legible (ej: Email ya registrado)
    if (error.clerkError && error.errors?.[0]) {
      const clerkMsg = error.errors[0].longMessage || error.errors[0].message || "Error de validación en Clerk."
      return { success: false, error: clerkMsg }
    }
    
    return { success: false, error: error.message || "Error inesperado al registrar el coach." }
  }
}
