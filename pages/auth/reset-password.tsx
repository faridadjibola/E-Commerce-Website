import type { NextPage } from 'next'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import AuthToast from '../../components/AuthToast'

const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'

const checksFor = (value: string) => [
  { label: '8+ characters', passed: value.length >= 8 },
  { label: 'Uppercase letter', passed: /[A-Z]/.test(value) },
  { label: 'Lowercase letter', passed: /[a-z]/.test(value) },
  { label: 'Number', passed: /\d/.test(value) },
  { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(value) },
]

const ResetPassword: NextPage = () => {
  const router = useRouter()
  const token = typeof router.query.token === 'string' ? router.query.token : ''
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const checks = checksFor(password)
  const strength = checks.filter((check) => check.passed).length
  const passwordError = checks.some((check) => !check.passed) ? 'Meet all five password requirements.' : ''
  const confirmationError = password !== confirmation ? 'Passwords must match.' : ''

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!token) { setError('This reset link is missing its token. Request a new link.'); return }
    setSubmitted(true)
    if (passwordError || confirmationError) return
    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const responseBody = await response.text().catch(() => '')
      const notConfigured = response.status === 404 || (response.status === 400 && responseBody.includes('not supported by NextAuth.js'))
      if (notConfigured) {
        setError('Password recovery is not connected yet. Please contact Tochiwears support.')
        return
      }
      if (response.status === 400 || response.status === 410) {
        setError('This reset link is invalid or has expired. Request a new link to continue.')
        return
      }
      if (!response.ok) {
        setError('We could not update your password. Request a new reset link and try again.')
        return
      }
      setStatus('Password updated. Taking you to sign in...')
      window.setTimeout(() => router.replace('/auth/signin?reset=success'), 1200)
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
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">Set a new password</h1>
        <p className="mt-2 text-sm text-gray-600">Choose a strong password you haven’t used before.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label htmlFor="reset-password" className="text-sm font-medium text-gray-800">New password</label>
            <div className="relative mt-1">
              <input id="reset-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} className={`${inputClass} pr-20`} aria-describedby="reset-strength" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-2 my-auto rounded px-2 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-900/20" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            <div id="reset-strength" className="mt-2" aria-live="polite">
              <div className="flex gap-1" aria-label={`Password strength ${strength} of 5`}>
                {checks.map((check, index) => <span key={check.label} className={`h-1.5 flex-1 rounded-full ${index < strength ? 'bg-emerald-600' : 'bg-gray-200'}`} />)}
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600 sm:grid-cols-3">
                {checks.map((check) => <li key={check.label} className={check.passed ? 'text-emerald-700' : ''}>{check.passed ? '✓' : '○'} {check.label}</li>)}
              </ul>
            </div>
            {submitted && passwordError && <p className="mt-1 text-sm text-red-700">{passwordError}</p>}
          </div>

          <div>
            <label htmlFor="reset-confirm" className="text-sm font-medium text-gray-800">Confirm new password</label>
            <input id="reset-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError('') }} className={inputClass} />
            {submitted && confirmationError && <p className="mt-1 text-sm text-red-700">{confirmationError}</p>}
          </div>

          <button type="submit" disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? 'Updating password...' : 'Update password'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600"><Link href="/auth/forgot-password" className="font-semibold text-gray-950 underline underline-offset-2">Request a fresh reset link</Link></p>
      </section>
    </div>
  )
}

export default ResetPassword