import type { NextApiRequest, NextApiResponse } from 'next'
import { createOrder, listOrders } from '../../../lib/orders'
import { getAllProducts } from '../../../lib/products'
import { CreateOrderRequest } from '../../../types/api'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload = req.body as CreateOrderRequest
    const products = getAllProducts()

    const items = payload.items.map(({ productId, quantity }) => {
      const product = products.find((p) => p.id === productId)
      return {
        productId,
        name: product?.name || 'Product',
        price: Number(product?.discount ?? product?.price ?? 0),
        quantity,
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = subtotal > 0 ? 2500 : 0
    const order = createOrder({
      userId: payload.userId || 'guest',
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'pending',
    })

    return res.status(201).json(order)
  }

  if (req.method === 'GET') {
    return res.json(listOrders())
  }

  res.setHeader('Allow', 'GET,POST')
  res.status(405).end()
}
