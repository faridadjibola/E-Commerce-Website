import { NextPage } from 'next'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Account: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-sm text-gray-600">Loading account...</div>
  }

  if (!session?.user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-2xl p-5 bg-gray-50">
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-2xl font-semibold">{session.user.name || 'Customer'}</h1>
          <p className="text-sm text-gray-600">{session.user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/account/orders" className="rounded-2xl border p-5 hover:bg-gray-50">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="mt-2 text-xl font-semibold">My Orders</div>
        </Link>
        <div className="rounded-2xl border p-5">
          <div className="text-sm text-gray-500">Saved</div>
          <div className="mt-2 text-xl font-semibold">Wishlist</div>
        </div>
        <div className="rounded-2xl border p-5">
          <div className="text-sm text-gray-500">Address</div>
          <div className="mt-2 text-xl font-semibold">Default address</div>
        </div>
      </div>

      <div className="border rounded-2xl p-5">
        <h2 className="text-lg font-semibold mb-3">Account overview</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="font-medium text-gray-900">Profile</div>
            <div className="mt-2">Name: {session.user.name || 'Not provided'}</div>
            <div>Email: {session.user.email}</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="font-medium text-gray-900">Support</div>
            <div className="mt-2">Reach us via WhatsApp or Instagram for quick order help.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
