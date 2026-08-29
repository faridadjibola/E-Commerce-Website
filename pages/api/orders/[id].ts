import type { NextApiRequest, NextApiResponse } from 'next'
import { getOrderById } from '../../../lib/orders'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })
  if (req.method === 'GET') {
    const o = getOrderById(id)
    if (!o) return res.status(404).json({ error: 'Not found' })
    return res.json(o)
  }
  res.setHeader('Allow', 'GET')
  res.status(405).end()
}
