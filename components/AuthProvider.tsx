import { createContext, ReactNode, useContext } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

type AuthResult = { ok: boolean; error?: string }
type AuthContextValue = {
  user: { id?: string; name?: string | null; email?: string | null; role?: string } | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  async function login(email: string, password: string, rememberMe = false): Promise<AuthResult> {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      rememberMe: String(rememberMe),
    })

    return result?.error ? { ok: false, error: result.error } : { ok: Boolean(result?.ok) }
  }

  async function logout() {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, loading: status === 'loading', login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}