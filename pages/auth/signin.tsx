import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../components/AuthProvider'
import AuthToast from '../../components/AuthToast'

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'

function safeInternalPath(value: string | string[] | undefined) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/account'
  try {
    const url = new URL(value, window.location.origin)
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : '/account'
  } catch {
    return '/account'
  }
}

const SignIn: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const auth = useAuth()

  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Enter a valid email address.' : ''
  const passwordError = !password ? 'Enter your password.' : ''
  const showEmailError = (submitted || touched.email) && emailError
  const showPasswordError = (submitted || touched.password) && passwordError

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    if (emailError || passwordError) return
    setIsLoading(true)
    try {
      const result = await auth.login(email.trim().toLowerCase(), password, rememberMe)
      if (!result.ok) {
        const reason = (router.query.error || result.error || '').toString().toLowerCase()
        setError(/lock|too.?many|rate.?limit|attempt/.test(reason)
          ? 'Too many sign-in attempts. Please wait a little while before trying again.'
          : 'Invalid email or password.')
        return
      }
      await router.replace(safeInternalPath(router.query.callbackUrl))
    } catch {
      setError('We could not sign you in right now. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <AuthToast message={error} tone="error" />
      <div className="grid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-[1.05fr_1fr]">
        <aside className="hidden bg-neutral-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Image src="/tochiwears logo.jpeg" alt="Tochiwears" width={64} height={64} className="mb-6 h-14 w-auto rounded-lg bg-white/5 p-2" priority />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Tochiwears account</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">Track orders, revisit your saved looks, and keep your checkout moving with a faster account experience.</p>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Fast checkout with saved details</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Order tracking and purchase history</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Exclusive drops and member offers</div>
          </div>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <Image src="/tochiwears logo.jpeg" alt="Tochiwears" width={48} height={48} className="h-12 w-auto rounded-lg bg-neutral-950 p-2" priority />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tochiwears</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-950">Sign in</h2>
            <p className="mt-1 text-sm text-gray-600">Use your email and password to continue shopping.</p>
          </div>

          {(router.query.sessionExpired === '1' || router.query.error === 'SessionExpired') && <p role="status" aria-live="polite" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Session expired, please sign in again.</p>}
          {router.query.reset === 'success' && <p role="status" aria-live="polite" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Password updated. Sign in with your new password.</p>}

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="signin-email" className="text-sm font-medium text-gray-800">Email address</label>
              <input id="signin-email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} onBlur={() => setTouched((value) => ({ ...value, email: true }))} className={inputClass} aria-invalid={Boolean(showEmailError)} aria-describedby={showEmailError ? 'signin-email-error' : undefined} />
              {showEmailError && <p id="signin-email-error" className="mt-1 text-sm text-red-700">{emailError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="signin-password" className="text-sm font-medium text-gray-800">Password</label>
                <Link href="/auth/forgot-password" className="text-sm font-medium text-gray-700 underline underline-offset-2 hover:text-black">Forgot password?</Link>
              </div>
              <div className="relative mt-1">
                <input id="signin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} onBlur={() => setTouched((value) => ({ ...value, password: true }))} className={`${inputClass} pr-20`} aria-invalid={Boolean(showPasswordError)} aria-describedby={showPasswordError ? 'signin-password-error' : undefined} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-2 my-auto rounded px-2 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-900/20" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              {showPasswordError && <p id="signin-password-error" className="mt-1 text-sm text-red-700">{passwordError}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-gray-900" />
              Remember me
            </label>

            <button type="submit" disabled={isLoading || auth.loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 border-t border-gray-200 pt-5 text-center text-sm text-gray-600">New to Tochiwears? <Link href="/register" className="font-semibold text-gray-950 underline underline-offset-2">Create an account</Link></p>
        </section>
      </div>
    </div>
  )
}

export default SignIn
