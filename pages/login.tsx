import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to unified signin page
    router.replace('/auth/signin')
  }, [router])

  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>
}
