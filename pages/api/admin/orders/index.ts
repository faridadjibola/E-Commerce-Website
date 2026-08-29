import type { NextApiRequest, NextApiResponse } from 'next'
import { listOrders } from '../../../../lib/orders'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    return res.json(listOrders())
  }
  res.setHeader('Allow', 'GET')
  res.status(405).end()
}
