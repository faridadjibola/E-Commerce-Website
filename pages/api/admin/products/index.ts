import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts, createProduct, normalizeProductInput } from '../../../../lib/products'
import { requireAdmin } from '../../../../lib/requireAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await requireAdmin(req, res))) return

  if (req.method === 'GET') {
    return res.json(getAllProducts())
  }

  if (req.method === 'POST') {
    try {
      const payload = req.body || {}
      const normalized = normalizeProductInput(payload)
      const product = createProduct(normalized)
      return res.status(201).json(product)
    } catch (error) {
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Unable to create product.'
      })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end()
}
