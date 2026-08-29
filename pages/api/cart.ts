import type { NextApiRequest, NextApiResponse } from 'next'
import { CartItem } from '../../types/api'

// Simple in-memory cart for demo purposes. Backend should replace with per-user persistence.
const CART: CartItem[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.json(CART)
  }

  if (req.method === 'POST') {
    const { productId, quantity } = req.body as { productId: string; quantity: number }
    if (!productId || !quantity) return res.status(400).json({ error: 'Missing productId or quantity' })
    const idx = CART.findIndex(c => c.productId === productId)
    if (idx >= 0) {
      CART[idx].quantity += Number(quantity)
    } else {
      CART.push({ productId, quantity: Number(quantity) })
    }
    return res.json(CART)
  }

  if (req.method === 'DELETE') {
    const { productId } = req.query
    if (!productId) return res.status(400).json({ error: 'Missing productId' })
    const idx = CART.findIndex(c => c.productId === String(productId))
    if (idx >= 0) CART.splice(idx, 1)
    return res.json(CART)
  }

  res.setHeader('Allow', 'GET,POST,DELETE')
  res.status(405).end()
}
