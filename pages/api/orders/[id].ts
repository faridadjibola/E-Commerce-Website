import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { getOrderById } from '../../../lib/orders'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })
  if (req.method === 'GET') {
    const o = getOrderById(id)
    if (!o) return res.status(404).json({ error: 'Not found' })

    const secret = process.env.NEXTAUTH_SECRET
    const token = secret ? await getToken({ req, secret }) : null
    const userId = (token?.user as { id?: string } | undefined)?.id
    if (!userId || o.userId !== userId) return res.status(403).json({ error: 'Order access denied' })

    return res.json(o)
  }
  res.setHeader('Allow', 'GET')
  res.status(405).end()
}
