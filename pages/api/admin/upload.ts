import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { filename, data } = req.body || {}
  if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' })

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  const filePath = path.join(uploadsDir, filename)

  // data is expected to be base64 string
  const matches = data.match(/^data:(.+);base64,(.+)$/)
  const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(data, 'base64')
  fs.writeFileSync(filePath, buffer)

  const url = `/uploads/${filename}`
  res.json({ url })
}
