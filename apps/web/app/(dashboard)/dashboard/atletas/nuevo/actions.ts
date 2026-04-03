'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClerkSupabaseClient } from '@/lib/supabase/client'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const athleteSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: z.string().regex(/^\d{10}$/, 'La cédula ecuatoriana debe tener exactamente 10 dígitos numéricos'),
  email: z.string().email('Correo electrónico no válido'),
  phone: z.string().min(7, 'Ingrese un número de teléfono válido'),
  birthDate: z.string().or(z.date()).optional(),
})

export async function createAthleteAction(formData: any) {
  console.log('[DEBUG] --- INICIO ACCIÓN CREATE ATHLETE ---')
  console.log('[DEBUG] 1. Llamando a auth()...')
  const { userId, getToken } = await auth()
  console.log('[DEBUG] userId:', userId)
  
  if (!userId) {
    console.error('[ERROR] No hay userId en la sesión')
    throw new Error('No autorizado')
  }

  // 1. Obtener Metadatos del Dueño (Gym ID)
  console.log('[DEBUG] 2. Obteniendo cliente Clerk y owner info...')
  const client = await clerkClient()
  const owner = await client.users.getUser(userId)
  const gymId = owner.publicMetadata.gym_id as string
  console.log('[DEBUG] gymId del dueño:', gymId)

  if (!gymId) {
    console.error('[ERROR] El dueño no tiene gym_id')
    return { error: 'No tienes un gimnasio asociado. Completa el onboarding primero.' }
  }

  // 2. Validar Inputs
  const validatedFields = athleteSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  const { firstName, lastName, dni, email, phone, birthDate } = validatedFields.data

  try {
    console.log('[DEBUG] 3. Obteniendo token de Clerk (template: supabase2)...')
    const token = await getToken({ template: 'supabase2' })
    if (!token) {
       console.error('[ERROR] Token supabase2 es nulo o indefinido')
       throw new Error('No se pudo generar el token "supabase2". Revisa Clerk.')
    }
    console.log('[DEBUG] Token obtenido con éxito.')
    const supabase = createClerkSupabaseClient(token)

    let athleteClerkId: string
    
    // 3. Gestión en Clerk
    console.log('[2/5] Gestionando usuario en Clerk...')
    try {
      const newUser = await client.users.createUser({
        emailAddress: [email],
        password: dni,
        firstName,
        lastName,
        publicMetadata: { role: 'athlete', gym_id: gymId },
        skipPasswordChecks: true
      })
      athleteClerkId = newUser.id
    } catch (clerkErr: any) {
      if (clerkErr.errors?.[0]?.code === 'form_identifier_exists') {
        const list = await client.users.getUserList({ emailAddress: [email] })
        athleteClerkId = list.data[0]?.id || ''
        if (!athleteClerkId) throw new Error('Usuario existente no recuperable')
      } else {
        throw clerkErr
      }
    }

    // 4. No enviamos invitación por ahora para evitar bloqueos
    console.log('[3/5] Invitación omitida temporalmente...')

    console.log('[DEBUG] 5. Sincronizando Perfil en Supabase...')
    const { error: pErr } = await supabase.from('profiles').upsert({
      id: athleteClerkId,
      full_name: `${firstName} ${lastName}`,
      email,
      phone,
      updated_at: new Date().toISOString()
    })
    if (pErr) {
       console.error('[ERROR] Upsert Profiles:', pErr)
       throw pErr
    }

    console.log('[DEBUG] 6. Sincronizando Membresía en Supabase...')
    const { error: mErr } = await supabase.from('gym_members').upsert({
      gym_id: gymId,
      user_id: athleteClerkId,
      role: 'athlete'
    })
    if (mErr) {
       console.error('[ERROR] Upsert GymMembers:', mErr)
       throw mErr
    }

    console.log('[DEBUG] 6.5 Sincronizando Atleta Específico en Supabase...')
    const { error: aErr } = await supabase.from('athletes').upsert({
      gym_id: gymId,
      user_id: athleteClerkId,
      birthdate: birthDate instanceof Date ? birthDate.toISOString().split('T')[0] : birthDate,
      is_active: true
    })
    if (aErr) {
       console.error('[ERROR] Upsert Athletes:', aErr)
       throw aErr
    }

    console.log('[DEBUG] 6.7 Enviando Correo de Bienvenida vía Resend...')
    try {
      const { data: gymData } = await supabase.from('gyms').select('name').eq('id', gymId).single()
      const gymName = gymData?.name || 'FITCLASS'

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'FITCLASS <onboarding@resend.dev>',
          to: [email],
          subject: `Bienvenido a ${gymName} - Tus Credenciales`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #5e5ce6;">¡Bienvenido a ${gymName}!</h2>
              <p>Hola <strong>${firstName}</strong>, tu cuenta ha sido creada exitosamente por tu gimnasio.</p>
              <p>Aquí tienes tus credenciales para acceder a la plataforma:</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Usuario:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Contraseña:</strong> ${dni}</p>
              </div>
              <p>Te recomendamos cambiar tu contraseña una vez que ingreses por primera vez.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <small style="color: #888;">Este es un correo automático de ${gymName} impulsado por FITCLASS.</small>
            </div>
          `
        })
      })

      if (!resendRes.ok) {
        const errorData = await resendRes.json()
        console.error('[ERROR] Fallo al enviar correo con Resend:', errorData)
      } else {
        console.log('[DEBUG] Correo enviado exitosamente.')
      }
    } catch (emailErr) {
      console.error('[ERROR] Error inesperado enviando correo:', emailErr)
      // No lanzamos error para no bloquear el registro si falla el correo
    }

    console.log('[DEBUG] 7. Finalizando y revalidando...')
    revalidatePath('/dashboard/atletas')
    console.log('[DEBUG] --- REGISTRO EXITOSO ---')
    return { success: true, credentials: { email, password: dni } }

  } catch (error: any) {
    console.error('ERROR CRÍTICO EN ACCIÓN:', error)
    return { error: error.message || 'Error en el servidor' }
  }
}
