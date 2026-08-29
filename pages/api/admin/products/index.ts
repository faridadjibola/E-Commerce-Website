import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts, createProduct } from '../../../../lib/products'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json(getAllProducts())
  }

  if (req.method === 'POST') {
    const data = req.body
    const p = createProduct(data)
    return res.status(201).json(p)
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end()
}
