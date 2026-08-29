import type { NextApiRequest, NextApiResponse } from 'next'
import { updateOrderStatus } from '../../../../lib/orders'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Demo webhook: provider sends { reference, orderId, status }
  const { orderId, status } = req.body || {}
  if (!orderId) return res.status(400).end()
  const o = updateOrderStatus(orderId, status || 'paid')
  if (!o) return res.status(404).end()
  res.json({ ok: true })
}
