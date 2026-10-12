import { NextPage } from 'next'
import Link from 'next/link'

const ForbiddenPage: NextPage = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">403</p>
        <h1 className="mt-4 text-3xl font-semibold text-gray-900">Access denied</h1>
        <p className="mt-3 text-sm text-gray-600">
          You do not have permission to view this admin area.
        </p>
        <Link href="/" className="mt-6 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default ForbiddenPage
