import type { NextApiRequest, NextApiResponse } from 'next'
import { listOrders } from '../../../../lib/orders'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json(listOrders())
  }
  res.setHeader('Allow', 'GET')
  res.status(405).end()
}
