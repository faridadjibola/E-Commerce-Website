import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { amount } = req.body || {}
  const reference = `MP${Date.now()}`
  // In real implementation call Moniepoint API server-side and return the authorization URL
  return res.json({ reference, authorization_url: `https://moniepoint.mock/authorize?ref=${reference}&amount=${amount}` })
}
