import { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Customer = {
  id: string
  name: string
  email: string
  role: string
}

const AdminCustomers: NextPage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) return

    const isAdmin = Boolean((session.user as any)?.role === 'admin' || (session.user as any)?.isAdmin)
    if (!isAdmin) {
      router.replace('/auth/signin?callbackUrl=/admin/customers')
      return
    }

    const loadCustomers = async () => {
      try {
        const res = await fetch('/api/admin/customers')
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'Could not load customers.')
        }
        setCustomers(await res.json())
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load customers.')
      }
    }

    loadCustomers()
  }, [session, router])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">Customers</p>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">Customer directory</h1>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase tracking-[0.12em] text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-4 py-3">{customer.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                        {customer.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const isAdmin = Boolean((session?.user as any)?.role === 'admin' || (session?.user as any)?.isAdmin)

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?callbackUrl=${encodeURIComponent('/admin/customers')}`,
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

  return { props: {} }
}

export default AdminCustomers
