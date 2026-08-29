import { NextPage } from 'next'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: any) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { redirect: false, email, password })
    // @ts-ignore
    if (res?.error) return setError('Invalid credentials')
    router.push('/account')
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="border rounded-2xl p-6 shadow-sm bg-white">
        <div className="mb-6 text-center">
          <img src="/tochiwears logo.jpeg" alt="Tochiwears main logo" className="mx-auto h-10 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-600">Sign in to continue your shopping</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-900">Forgot password?</a>
            </div>
            <input className="w-full border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button className="w-full rounded-xl bg-neutral-900 px-4 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-300" type="submit">Sign in</button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          New to Tochiwears?{' '}
          <Link href="/register" className="font-semibold text-gray-900 underline decoration-gray-400 underline-offset-4 hover:text-black">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn
