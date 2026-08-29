import { getToken } from 'next-auth/jwt'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    res.status(500).json({ error: 'Authentication is not configured' })
    return false
  }

  const token = await getToken({ req, secret })
  if (!token?.isAdmin) {
    res.status(403).json({ error: 'Admin access required' })
    return false
  }

  return true
}