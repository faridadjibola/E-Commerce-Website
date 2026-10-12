import { FormEvent, useState } from 'react'
import { CheckCircle2, LoaderCircle, Mail, MessageCircle, Phone, Send } from 'lucide-react'
import PageMeta from '../components/PageMeta'

const WHATSAPP_URL = 'https://wa.me/message/HLJIV7IE6GKAG1'
const INSTAGRAM_URL = 'https://www.instagram.com/tochi_wears?igsh=YWczeDE4M2E2YzEx'
const TIKTOK_URL = 'https://www.tiktok.com/@tochiwears'

type FormValues = { name: string; email: string; phone: string; message: string; website: string }
const initialValues: FormValues = { name: '', email: '', phone: '', message: '', website: '' }

export default function Contact() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    if (status !== 'idle') setStatus('idle')
  }

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {}
    if (values.name.trim().length < 2) nextErrors.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!/^\+?[0-9()\-\s]{7,20}$/.test(values.phone.trim())) nextErrors.phone = 'Enter a valid phone number.'
    if (values.message.trim().length < 10) nextErrors.message = 'Please tell us how we can help.'
    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setServerMessage('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to send your message.')
      setStatus('success')
      setServerMessage(data.message || 'Your message has been received.')
      setValues(initialValues)
    } catch (error) {
      setStatus('error')
      setServerMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <div>
      <PageMeta title="Contact Us" description="Contact Tochiwears for product, order, delivery, or return support." canonicalPath="/contact" />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Contact</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">How can we help?</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">Send us a message about an order, product, delivery, or return. We usually reply within 24 hours.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 text-sm text-gray-700 transition hover:text-gray-950"><MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat with us</a>
            <p className="mt-2 text-sm text-gray-600">Phone: 09027951472</p>
            <a href="tel:+2349027951472" className="mt-1 flex items-center gap-2 text-sm text-gray-700 transition hover:text-gray-950"><Phone className="h-4 w-4" aria-hidden="true" /> Call us</a>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-900">Email</p>
            <a href="mailto:hello@tochiwears.com" className="mt-2 flex items-center gap-2 text-sm text-gray-700 transition hover:text-gray-950"><Mail className="h-4 w-4" aria-hidden="true" /> hello@tochiwears.com</a>
            <p className="mt-3 text-xs text-gray-500">Lagos, Nigeria · Online store</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800"><svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2Zm5.1-3.2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" /></svg></a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800"><span className="text-xs font-bold">♪</span></a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white transition hover:bg-green-700"><MessageCircle className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </aside>

        <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-gray-700">Name</label>
              <input id="contact-name" value={values.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100" placeholder="Your name" />
              {errors.name && <p id="contact-name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input id="contact-email" type="email" value={values.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100" placeholder="you@example.com" />
              {errors.email && <p id="contact-email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
              <input id="contact-phone" type="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'contact-phone-error' : undefined} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100" placeholder="0802 795 1472" />
              {errors.phone && <p id="contact-phone-error" className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-gray-700">Message</label>
              <textarea id="contact-message" rows={5} value={values.message} onChange={(event) => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100" placeholder="Tell us what you need help with." />
              {errors.message && <p id="contact-message-error" className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="website" className="sr-only">Website</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update('website', event.target.value)} className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true" />
            </div>
          </div>

          {status === 'success' && <div role="status" className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{serverMessage}</div>}
          {status === 'error' && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverMessage}</div>}

          <button type="submit" disabled={status === 'submitting'} className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {status === 'submitting' ? <><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending...</> : <><Send className="h-4 w-4" aria-hidden="true" /> Send message</>}
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}
