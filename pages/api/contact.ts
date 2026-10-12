import type { NextApiRequest, NextApiResponse } from 'next'

const REQUEST_LIMIT = 5
const WINDOW_MS = 15 * 60 * 1000
const requests = new Map<string, { count: number; resetAt: number }>()

type ContactForm = {
  name?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  website?: unknown
}

function getClientKey(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || 'unknown'
  return String(ip).trim()
}

function isRateLimited(req: NextApiRequest) {
  const key = getClientKey(req)
  const current = requests.get(key)
  if (!current || current.resetAt <= Date.now()) {
    requests.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS })
    return false
  }
  if (current.count >= REQUEST_LIMIT) return true
  current.count += 1
  return false
}

function sanitize(value: string) {
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (isRateLimited(req)) return res.status(429).json({ error: 'Too many messages. Please wait 15 minutes and try again.' })

  const body = req.body as ContactForm | undefined
  const name = typeof body?.name === 'string' ? sanitize(body.name) : ''
  const email = typeof body?.email === 'string' ? sanitize(body.email).toLowerCase() : ''
  const phone = typeof body?.phone === 'string' ? sanitize(body.phone) : ''
  const message = typeof body?.message === 'string' ? sanitize(body.message) : ''
  const honeypot = typeof body?.website === 'string' ? body.website.trim() : ''

  if (honeypot) return res.status(400).json({ error: 'Unable to submit message.' })
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Enter a valid name.' })
  if (!isValidEmail(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (!/^\+?[0-9()\-\s]{7,20}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid phone number.' })
  if (message.length < 10 || message.length > 2000) return res.status(400).json({ error: 'Tell us a little more about your message.' })

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL
  const webhookKey = process.env.CONTACT_WEBHOOK_API_KEY
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(webhookKey ? { Authorization: `Bearer ${webhookKey}` } : {}),
        },
        body: JSON.stringify({ name, email, phone, message, source: 'tochiwears-contact-form' }),
      })
      if (!response.ok) throw new Error('Contact service rejected the message.')
    } catch (error) {
      return res.status(502).json({ error: 'We could not send your message. Please try again later.' })
    }
  }

  return res.status(202).json({ ok: true, message: 'Your message has been received.' })
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '8kb' },
  },
}
