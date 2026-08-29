import { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'

const Register: NextPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: any) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error || 'Registration failed')
    // redirect to sign in
    router.push('/auth/signin')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input className="w-full border px-3 py-2" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="bg-black text-white px-4 py-2 rounded" type="submit">Create account</button>
      </form>
    </div>
  )
}

export default Register
