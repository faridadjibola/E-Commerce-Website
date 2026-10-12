import type { NextPage } from 'next'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import AuthToast from '../../components/AuthToast'

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Enter a valid email address.' : ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setStatus('')
    setError('')
    if (emailError) return
    setLoading(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const responseBody = await response.text().catch(() => '')
      const notConfigured = response.status === 404 || (response.status === 400 && responseBody.includes('not supported by NextAuth.js'))
      if (notConfigured) {
        setError('Password recovery is not connected yet. Please contact Tochiwears support.')
      } else if (response.ok) {
        setStatus('If that email exists, we sent a password reset link. Check your inbox shortly.')
      } else {
        setError('We could not process the recovery request right now. Please try again later.')
      }
    } catch {
      setError('We could not reach the password recovery service. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <AuthToast message={error} tone="error" />
      <AuthToast message={status} tone="success" />
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Account recovery</p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">Forgot your password?</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">Enter the email associated with your account. We’ll show the same confirmation either way.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="forgot-email" className="text-sm font-medium text-gray-800">Email address</label>
            <input id="forgot-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} onBlur={() => setTouched(true)} className={inputClass} aria-invalid={Boolean((submitted || touched) && emailError)} aria-describedby={(submitted || touched) && emailError ? 'forgot-email-error' : undefined} />
            {(submitted || touched) && emailError && <p id="forgot-email-error" className="mt-1 text-sm text-red-700">{emailError}</p>}
          </div>

          <button type="submit" disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? 'Sending request...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600"><Link href="/auth/signin" className="font-semibold text-gray-950 underline underline-offset-2">Back to sign in</Link></p>
      </section>
    </div>
  )
}

export default ForgotPassword