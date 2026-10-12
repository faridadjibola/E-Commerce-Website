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
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Account</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Orders</h1>
        </div>
        <div className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
          {orders.length} total
        </div>
      </div>

      {orders.length === 0 && (
        <div className="rounded-[22px] border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-gray-600">
          No orders yet. Start shopping to see your history here.
        </div>
      )}

      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm text-gray-500">Order #{o.id}</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">₦{o.total?.toLocaleString()}</div>
                <div className="mt-2 text-sm text-gray-600">Status: <span className="font-medium text-gray-900">{o.status}</span></div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                  {o.status}
                </span>
                <Link href={`/account/orders/${o.id}`} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-900 transition hover:bg-white">View order</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
