import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllProducts, getProductBySlug } from '../../lib/products'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  if (slug) {
    const product = getProductBySlug(String(slug))
    if (!product) return res.status(404).json({error: 'Not found'})
    return res.json(product)
  }
  const products = getAllProducts()
  res.json(products)
}
