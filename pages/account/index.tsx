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
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`)
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className="text-sm text-gray-600">Loading account...</div>
  }

  if (!session?.user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[24px] border border-gray-200 bg-gray-50 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Welcome back</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{session.user.name || 'Customer'}</h1>
          <p className="mt-1 text-sm text-gray-600">{session.user.email}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 transition hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/account/orders" className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="mt-2 text-xl font-semibold text-gray-900">My Orders</div>
        </Link>

        <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Saved</div>
          <div className="mt-2 text-xl font-semibold text-gray-900">Wishlist</div>
        </div>

        <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Address</div>
          <div className="mt-2 text-xl font-semibold text-gray-900">Default address</div>
        </div>
      </div>

      <div className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Account overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="font-medium text-gray-900">Profile</div>
            <div className="mt-2 text-sm text-gray-600">Name: {session.user.name || 'Not provided'}</div>
            <div className="mt-1 text-sm text-gray-600">Email: {session.user.email}</div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="font-medium text-gray-900">Support</div>
            <div className="mt-2 text-sm text-gray-600">Reach us via WhatsApp or Instagram for quick order help.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
