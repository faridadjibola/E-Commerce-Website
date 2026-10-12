import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getProductById,
  updateProductById,
  deleteProductById,
  normalizeProductInput,
} from '../../../../lib/products'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return

  const { id } = req.query
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' })

  if (req.method === 'GET') {
    const p = getProductById(id)
    if (!p) return res.status(404).json({ error: 'Not found' })
    return res.json(p)
  }

  if (req.method === 'PUT') {
    try {
      const payload = req.body || {}
      const normalized = normalizeProductInput({ ...payload, id })
      const updated = updateProductById(id, normalized)
      if (!updated) return res.status(404).json({ error: 'Not found' })
      return res.json(updated)
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Unable to update product.'
      })
    }
  }

  if (req.method === 'DELETE') {
    const ok = deleteProductById(id)
    if (!ok) return res.status(404).json({ error: 'Not found' })
    return res.json({ ok: true })
  }

  res.setHeader('Allow', 'GET,PUT,DELETE')
  res.status(405).end()
}
