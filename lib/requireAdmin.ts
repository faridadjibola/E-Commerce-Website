import { getToken } from 'next-auth/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isAdminEmail } from './admin'

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    res.status(500).json({ error: 'Authentication is not configured' })
    return false
  }

  const token = await getToken({ req, secret })
  if (!token) {
    res.status(401).json({ error: 'Authentication required' })
    return false
  }

  const role = String((token as any).role || (token as any).user?.role || '').toLowerCase()
  const email = String((token as any).email || (token as any).user?.email || '').toLowerCase()
  const isAdmin = role === 'admin' || isAdminEmail(email)

  if (!isAdmin) {
    res.status(403).json({ error: 'Admin access required' })
    return false
  }

  return true
}