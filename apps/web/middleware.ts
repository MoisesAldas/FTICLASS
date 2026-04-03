// ─────────────────────────────────────────────────────────────────────────────
// Middleware de autenticación con Clerk
// Protege todas las rutas de /dashboard y /onboarding
// Redirige a /login si no hay sesión activa
// ─────────────────────────────────────────────────────────────────────────────

import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/registro(.*)',
  '/api/webhooks(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  // 1. Si NO está logueado y la ruta es protegida → al Login
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // 2. Si está logueado, protegemos el flujo de Onboarding
  if (userId) {
    let gymId = (sessionClaims?.metadata as any)?.gym_id

    // Si el token no tiene gym_id, verificamos directamente en la API de Clerk
    // Esto previene el bucle infinito justo después del onboarding
    if (!gymId) {
      try {
        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        gymId = (user.publicMetadata as any)?.gym_id
      } catch (err) {
        console.error('[Middleware] Error al verificar metadata fresca:', err)
      }
    }

    const hasGym = !!gymId
    const isOnboardingRoute = req.nextUrl.pathname.startsWith('/onboarding')
    const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                       req.nextUrl.pathname.startsWith('/registro') || 
                       req.nextUrl.pathname.startsWith('/api/webhooks')

    // Si NO tiene gimnasio, NO está en onboarding y NO es una ruta de auth/webhooks → redirigir a onboarding
    if (!hasGym && !isOnboardingRoute && !isAuthRoute) {
      return Response.redirect(new URL('/onboarding', req.url))
    }

    // Si YA tiene gimnasio e intenta ir a onboarding → al dashboard
    if (hasGym && isOnboardingRoute) {
      return Response.redirect(new URL('/dashboard', req.url))
    }

    // 3. Redirección automática si el usuario logueado entra a la Landing Page (/)
    if (req.nextUrl.pathname === '/') {
      return Response.redirect(new URL(hasGym ? '/dashboard' : '/onboarding', req.url))
    }
  }
})

export const config = {
  matcher: [
    // Salta archivos estáticos de Next.js y los archivos internos
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre corre para rutas de API
    '/(api|trpc)(.*)',
  ],
}
