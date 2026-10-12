import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import { useSession } from 'next-auth/react'

const OrderDetail: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { status } = useSession()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
      return
    }
    if (status !== 'authenticated' || !id) return
    ;(async () => {
      try {
        const o = await api.getOrder(String(id))
        setOrder(o)
      } catch (e) {
        setOrder(null)
      }
    })()
  }, [id, status, router])

  if (status === 'loading' || status === 'unauthenticated') return <div role="status">Checking your sign-in...</div>
  if (!order) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Order detail</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order #{order.id}</h1>
        </div>
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
              <span>Placed</span>
              <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
              <span>Status</span>
              <span className="font-medium text-gray-900">{order.status}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Total</span>
              <span className="font-bold text-gray-900">₦{order.total?.toLocaleString()}</span>
            </div>
          </div>

          <h4 className="mt-6 text-lg font-semibold text-gray-900">Items</h4>
          <ul className="mt-4 space-y-3">
            {order.items.map((it: any) => (
              <li key={it.productId} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm">
                <div>
                  <div className="font-medium text-gray-900">{it.name || it.productId}</div>
                  <div className="mt-1 text-gray-500">Qty {it.quantity}</div>
                </div>
                <div className="font-semibold text-gray-900">₦{(it.price ?? 0).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-[22px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-lg font-semibold text-gray-900">Delivery summary</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="font-medium text-gray-900">Shipping address</div>
              <div className="mt-2">{order.address?.fullName || 'Customer'}</div>
              <div>{order.address?.addressLine || 'Address unavailable'}</div>
              <div>{order.address?.city || 'City unavailable'}, {order.address?.state || 'State unavailable'}</div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <div className="font-medium text-gray-900">Payment</div>
              <div className="mt-2">{order.payment?.method || 'Not specified'}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetail
