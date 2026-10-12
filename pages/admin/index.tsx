import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { getSession } from 'next-auth/react'
import { listOrders } from '../../lib/orders'
import { Product, getAllProducts } from '../../lib/products'
import { getAllUsers } from '../../lib/users'

type AdminProps = {
  products: Product[]
  orders: any[]
  customers: Array<{ id: string; name: string; email: string; role: string }>
}

const Admin: NextPage<AdminProps> = ({ products, orders, customers }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const pendingOrders = orders.filter((order) => order.status === 'pending').length
  const lowStockItems = products.filter((product) => product.stock < 5).length
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const stats = [
    {
      label: 'Revenue',
      value: `₦${totalRevenue.toLocaleString()}`,
      detail: `${orders.length} total orders`,
      accent: 'bg-black text-white',
    },
    {
      label: 'Products',
      value: String(products.length),
      detail: `${lowStockItems} low stock`,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Customers',
      value: String(customers.length),
      detail: 'Registered users',
      accent: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Pending',
      value: String(pendingOrders),
      detail: 'Awaiting action',
      accent: 'bg-red-50 text-red-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Products
          </Link>
          <Link href="/admin/orders" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
            Orders
          </Link>
          <Link href="/admin/customers" className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            Customers
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border border-gray-200 p-4 shadow-sm ${stat.accent}`}>
            <div className="text-xs font-medium uppercase tracking-[0.15em] opacity-75">{stat.label}</div>
            <div className="mt-3 text-3xl font-semibold">{stat.value}</div>
            <div className="mt-2 text-sm opacity-80">{stat.detail}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
                No orders yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-600">
                      {order.customerName || 'Customer'} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">₦{Number(order.total || 0).toLocaleString()}</span>
                    <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <Link href="/admin/products/create" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              Add new product
            </Link>
            <Link href="/admin/products" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              Manage catalog
            </Link>
            <Link href="/admin/orders" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              Update order statuses
            </Link>
            <Link href="/admin/customers" className="block rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
              Review customers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async (context) => {
  const session = await getSession(context)
  const isAdmin = Boolean((session?.user as any)?.role === 'admin' || (session?.user as any)?.isAdmin)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent('/admin')}`,
        permanent: false,
      },
    }
  }

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/403',
        permanent: false,
      },
    }
  }

  const [products, orders, customers] = await Promise.all([
    getAllProducts(),
    listOrders(),
    getAllUsers(),
  ])

  return {
    props: {
      products,
      orders,
      customers,
    },
  }
}

export default Admin
