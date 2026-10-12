import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllUsers } from '../../../../lib/users'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    return res.json(getAllUsers())
  }

  res.setHeader('Allow', 'GET')
  res.status(405).end()
}
