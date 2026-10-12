import Link from 'next/link'
import Image from 'next/image'
import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import AuthToast from '../components/AuthToast'

type RegisterFields = 'name' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'terms'
type Errors = Partial<Record<RegisterFields, string>>

const fieldClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'

function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, '')
}

function validatePhone(value: string) {
  return /^(?:0(?:70|80|81|90|91)\d{8}|\+234(?:70|80|81|90|91)\d{8})$/.test(normalizePhone(value))
}

function passwordChecks(password: string) {
  return [
    { label: '8+ characters', passed: password.length >= 8 },
    { label: 'Uppercase letter', passed: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', passed: /[a-z]/.test(password) },
    { label: 'Number', passed: /\d/.test(password) },
    { label: 'Symbol', passed: /[^A-Za-z0-9]/.test(password) },
  ]
}

const Register: NextPage = () => {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', terms: false })
  const [touched, setTouched] = useState<Partial<Record<RegisterFields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  function validate(values = form): Errors {
    const errors: Errors = {}
    if (!values.name.trim()) errors.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
    if (!validatePhone(values.phone)) errors.phone = 'Use a Nigerian number such as 08012345678 or +2348012345678.'
    if (passwordChecks(values.password).some((check) => !check.passed)) errors.password = 'Meet all five password requirements.'
    if (!values.confirmPassword || values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords must match.'
    if (!values.terms) errors.terms = 'Accept the Terms and Privacy Policy to continue.'
    return errors
  }

  const errors = validate()
  const checks = passwordChecks(form.password)
  const strength = checks.filter((check) => check.passed).length
  const visibleError = (field: RegisterFields) => (submitted || touched[field] ? errors[field] : undefined)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setError('')
    setNotice('')
    if (Object.keys(errors).length) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: normalizePhone(form.phone), password: form.password }),
      })
      if (response.ok) {
        setNotice('Your account is ready. Taking you to sign in...')
        window.setTimeout(() => router.push('/auth/signin'), 1200)
      } else if (response.status === 409) {
        setError('We could not complete sign-up with those details. Try signing in or use password recovery.')
      } else {
        setError('We could not create your account right now. Check your details and try again.')
      }
    } catch {
      setError('We could not reach the sign-up service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <AuthToast message={error} tone="error" />
      <AuthToast message={notice} tone="success" />
      <div className="grid overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm lg:grid-cols-[1.05fr_1fr]">
        <aside className="hidden bg-neutral-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Image src="/tochiwears logo.jpeg" alt="Tochiwears" width={64} height={64} className="mb-6 h-14 w-auto rounded-lg bg-white/5 p-2" priority />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Tochiwears account</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">Join the community, manage your orders, and keep every checkout faster with one saved profile.</p>
          </div>

          <div className="space-y-3 text-sm text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">One-click tracking for each order</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Saved preferences for future orders</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Early access to new drops</div>
          </div>
        </aside>

        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
              <Image src="/tochiwears logo.jpeg" alt="Tochiwears" width={48} height={48} className="h-12 w-auto rounded-lg bg-neutral-950 p-2" priority />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Tochiwears</p>
            </div>
            <h2 className="text-2xl font-bold text-gray-950">Create account</h2>
            <p className="mt-1 text-sm text-gray-600">Save your details and keep track of your orders.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="register-name" className="text-sm font-medium text-gray-800">Full name</label>
              <input id="register-name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} onBlur={() => setTouched((value) => ({ ...value, name: true }))} className={fieldClass} aria-invalid={Boolean(visibleError('name'))} aria-describedby={visibleError('name') ? 'register-name-error' : undefined} />
              {visibleError('name') && <p id="register-name-error" className="mt-1 text-sm text-red-700">{visibleError('name')}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className="text-sm font-medium text-gray-800">Email address</label>
              <input id="register-email" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={(event) => update('email', event.target.value)} onBlur={() => setTouched((value) => ({ ...value, email: true }))} className={fieldClass} aria-invalid={Boolean(visibleError('email'))} aria-describedby={visibleError('email') ? 'register-email-error' : undefined} />
              {visibleError('email') && <p id="register-email-error" className="mt-1 text-sm text-red-700">{visibleError('email')}</p>}
            </div>

            <div>
              <label htmlFor="register-phone" className="text-sm font-medium text-gray-800">Nigerian phone number</label>
              <input id="register-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="08012345678 or +2348012345678" value={form.phone} onChange={(event) => update('phone', event.target.value)} onBlur={() => setTouched((value) => ({ ...value, phone: true }))} className={fieldClass} aria-invalid={Boolean(visibleError('phone'))} aria-describedby={visibleError('phone') ? 'register-phone-error' : undefined} />
              {visibleError('phone') && <p id="register-phone-error" className="mt-1 text-sm text-red-700">{visibleError('phone')}</p>}
            </div>

            <div>
              <label htmlFor="register-password" className="text-sm font-medium text-gray-800">Password</label>
              <div className="relative mt-1">
                <input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={(event) => update('password', event.target.value)} onBlur={() => setTouched((value) => ({ ...value, password: true }))} className={`${fieldClass} pr-20`} aria-invalid={Boolean(visibleError('password'))} aria-describedby="password-strength register-password-error" />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-2 my-auto rounded px-2 text-xs font-semibold text-gray-700 outline-none hover:bg-gray-100 focus:ring-2 focus:ring-gray-900/20" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              <div id="password-strength" className="mt-2" aria-live="polite">
                <div className="flex gap-1" aria-label={`Password strength ${strength} of 5`}>
                  {checks.map((check, index) => <span key={check.label} className={`h-1.5 flex-1 rounded-full ${index < strength ? 'bg-emerald-600' : 'bg-gray-200'}`} />)}
                </div>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-600 sm:grid-cols-3">
                  {checks.map((check) => <li key={check.label} className={check.passed ? 'text-emerald-700' : ''}>{check.passed ? '✓' : '○'} {check.label}</li>)}
                </ul>
              </div>
              {visibleError('password') && <p id="register-password-error" className="mt-1 text-sm text-red-700">{visibleError('password')}</p>}
            </div>

            <div>
              <label htmlFor="register-confirm" className="text-sm font-medium text-gray-800">Confirm password</label>
              <input id="register-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update('confirmPassword', event.target.value)} onBlur={() => setTouched((value) => ({ ...value, confirmPassword: true }))} className={fieldClass} aria-invalid={Boolean(visibleError('confirmPassword'))} aria-describedby={visibleError('confirmPassword') ? 'register-confirm-error' : undefined} />
              {visibleError('confirmPassword') && <p id="register-confirm-error" className="mt-1 text-sm text-red-700">{visibleError('confirmPassword')}</p>}
            </div>

            <div>
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={form.terms} onChange={(event) => update('terms', event.target.checked)} onBlur={() => setTouched((value) => ({ ...value, terms: true }))} className="mt-1 h-4 w-4 rounded border-gray-300 accent-black focus:ring-gray-900" aria-invalid={Boolean(visibleError('terms'))} />
                <span>I agree to the <Link href="/terms" className="font-medium underline underline-offset-2">Terms</Link> and <Link href="/privacy" className="font-medium underline underline-offset-2">Privacy Policy</Link>.</span>
              </label>
              {visibleError('terms') && <p className="mt-1 text-sm text-red-700">{visibleError('terms')}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {isLoading && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">Already have an account? <Link href="/auth/signin" className="font-semibold text-gray-950 underline underline-offset-2">Sign in</Link></p>
        </section>
      </div>
    </div>
  )
}

export default Register
