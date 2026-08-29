import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '../../../lib/api'

const OrderDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const o = await api.getOrder(String(id))
        setOrder(o)
      } catch (e) {
        setOrder(null)
      }
    })()
  }, [id])

  if (!order) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order {order.id}</h1>
      <div className="border rounded p-4">
        <div className="mb-2">Status: <strong>{order.status}</strong></div>
        <div className="mb-2">Total: ₦{order.total?.toLocaleString()}</div>
        <div className="mb-2">Created: {new Date(order.createdAt).toLocaleString()}</div>
        <h4 className="font-semibold mt-4">Items</h4>
        <ul className="mt-2 space-y-2">
          {order.items.map((it: any) => (
            <li key={it.productId} className="flex justify-between">
              <div>{it.name || it.productId} x {it.quantity}</div>
              <div>₦{(it.price ?? 0).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default OrderDetail
