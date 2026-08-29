import { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Login: NextPage = () => {
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
          <img src="/logo.svg" alt="Tochiwears" className="mx-auto h-12 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold">Login</h1>
          <p className="mt-1 text-sm text-gray-600">Continue to your account</p>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input className="w-full border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input className="w-full border px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <button className="w-full bg-black text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition" type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login
