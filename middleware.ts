import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isAdminEmail } from './lib/admin'

const ADMIN_PATHS = ['/admin', '/api/admin']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    const token = process.env.NEXTAUTH_SECRET
      ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      : null

    const role = String((token as any)?.role || (token as any)?.user?.role || '').toLowerCase()
    const email = String((token as any)?.email || (token as any)?.user?.email || '').toLowerCase()
    const isAdmin = role === 'admin' || isAdminEmail(email)

    if (!isAdmin) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }
      const signInUrl = new URL('/auth/signin', req.url)
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
