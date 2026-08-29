import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser, findUserByEmail } from '../../../lib/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  const existing = await findUserByEmail(email)
  if (existing) return res.status(409).json({ error: 'User exists' })
  const user = await createUser(name, email, password)
  if (!user) return res.status(500).json({ error: 'Could not create user' })
  res.json({ ok: true, user })
}
