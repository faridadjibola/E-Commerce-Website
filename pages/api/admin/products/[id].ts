import type { NextApiRequest, NextApiResponse } from 'next'
import { getProductById, updateProductById, deleteProductById } from '../../../../lib/products'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })

  if (req.method === 'GET') {
    const p = getProductById(id)
    if (!p) return res.status(404).json({ error: 'Not found' })
    return res.json(p)
  }

  if (req.method === 'PUT') {
    const updated = updateProductById(id, req.body)
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    const ok = deleteProductById(id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.json({ ok: true })
  }

  res.setHeader('Allow', 'GET,PUT,DELETE')
  res.status(405).end()
}
