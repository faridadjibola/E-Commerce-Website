import { NextPage } from 'next'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const SignIn: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: any) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    const res = await signIn('credentials', { redirect: false, email, password })
    setIsLoading(false)
    // @ts-ignore
    if (res?.error) return setError('Invalid credentials')
    router.push('/account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="text-center mb-8">
            <img src="/tochiwears logo.jpeg" alt="Tochiwears" className="mx-auto h-16 w-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Tochiwears</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue shopping</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email"
                required
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e)=>setEmail(e.target.value)} 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-gray-600 hover:text-gray-900 transition">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-transparent transition" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} 
              />
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-black hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
