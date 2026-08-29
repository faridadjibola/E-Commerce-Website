import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { amount } = req.body || {}
  const reference = `CD${Date.now()}`
  // In real implementation integrate with card gateway and return redirect/3DS URL
  return res.json({ reference, authorization_url: `https://cardgateway.mock/authorize?ref=${reference}&amount=${amount}` })
}
