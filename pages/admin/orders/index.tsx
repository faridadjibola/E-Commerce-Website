import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const AdminOrders: NextPage = () => {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      // simple admin check
      const s = await fetch('/api/auth/session')
      const sess = await s.json().catch(()=>null)
      if (!sess?.user?.email || sess.user.email !== 'admin@tochiwears.ng') {
        window.location.href = '/auth/signin'
        return
      }
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data)
    })()
  }, [])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Manage Orders</h1>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Order {o.id}</div>
                <div className="text-sm text-gray-600">Total: ₦{o.total?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Status: {o.status}</div>
              </div>
              <div className="flex items-center gap-2">
                <select defaultValue={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="border px-2 py-1">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminOrders
