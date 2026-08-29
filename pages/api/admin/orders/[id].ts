import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus, getOrderById } from '../../../../lib/orders'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })

  if (req.method === 'PUT') {
    const { status } = req.body || {}
    const o = updateOrderStatus(id, status)
    if (!o) return res.status(404).json({ error: 'Not found' })
    return res.json(o)
  }

  if (req.method === 'GET') {
    const o = getOrderById(id)
    if (!o) return res.status(404).json({ error: 'Not found' })
    return res.json(o)
  }

  res.setHeader('Allow', 'GET,PUT')
  res.status(405).end()
}
