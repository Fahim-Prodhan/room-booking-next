import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isUserRoute = createRouteMatcher(['/user(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'booking_admin') {
    const url = new URL('/', req.url)
    return NextResponse.redirect(url)
  }
   if (isUserRoute(req)){ 
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}