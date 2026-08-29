import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getOrders } from '../../../lib/api'

const OrdersPage: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status !== 'authenticated') return

    ;(async () => {
      try {
        const list = await getOrders()
        setOrders(list)
      } catch (e) {
        setOrders([])
      }
    })()
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-sm text-gray-600">Loading orders...</div>
  }

  if (!session?.user) return null

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 && <div className="text-sm text-gray-600">No orders yet.</div>}
      <div className="space-y-4 mt-4">
        {orders.map(o => (
          <div key={o.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">Order {o.id}</div>
              <div className="text-sm text-gray-600">Status: {o.status}</div>
              <div className="text-sm text-gray-600">Total: ₦{o.total?.toLocaleString()}</div>
            </div>
            <div>
              <Link href={`/account/orders/${o.id}`} className="text-blue-600">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
