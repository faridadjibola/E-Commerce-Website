import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PATHS = ['/admin', '/api/admin']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // match admin pages and api
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    // read token cookie created by NextAuth
    const token = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token')
    if (!token) {
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }

    // For demo, we can't validate JWT here without secret decoding; rely on server API checks too.
    // Allow through; server-side API routes will verify `isAdmin` via session middleware.
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
