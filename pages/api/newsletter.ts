import type { NextApiRequest, NextApiResponse } from 'next'
import { normalizeNewsletterEmail } from '../../lib/newsletter'

type NewsletterResponse = { message?: string; error?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsletterResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = normalizeNewsletterEmail(req.body?.email)
  if (!email) return res.status(400).json({ error: 'Enter a valid email address.' })

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL
  if (!webhookUrl) return res.status(503).json({ error: 'Newsletter signups are not available right now.' })

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEWSLETTER_WEBHOOK_API_KEY
          ? { Authorization: `Bearer ${process.env.NEWSLETTER_WEBHOOK_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({ email, source: 'tochiwears-homepage' }),
    })
    if (!response.ok) throw new Error('Newsletter provider rejected the signup.')
    return res.status(202).json({ message: 'You are subscribed. Thank you!' })
  } catch {
    return res.status(502).json({ error: 'We could not complete your signup. Please try again later.' })
  }
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '2kb' },
  },
}