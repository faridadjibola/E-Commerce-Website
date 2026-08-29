import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const reference = `BT${Date.now()}`
  // Return mock bank details for transfer
  return res.json({ reference, account_number: '0123456789', account_name: 'Tochiwears', bank_name: 'Mock Bank' })
}
