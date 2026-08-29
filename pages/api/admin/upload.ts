import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { requireAdmin } from '../../../lib/requireAdmin'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  if (!(await requireAdmin(req, res))) return

  const { filename, data } = req.body || {}
  if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' })

  const safeFilename = path.basename(filename)
  if (safeFilename !== filename || !/^[-a-zA-Z0-9_.]+$/.test(safeFilename)) {
    return res.status(400).json({ error: 'Invalid filename' })
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  const matches = data.match(/^data:(.+);base64,(.+)$/)
  const contentType = matches?.[1]
  if (!contentType || !ALLOWED_TYPES.has(contentType)) {
    return res.status(400).json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' })
  }

  const buffer = Buffer.from(matches[2], 'base64')
  if (buffer.length > MAX_UPLOAD_BYTES) return res.status(413).json({ error: 'Image exceeds 5 MB limit' })

  const filePath = path.join(uploadsDir, safeFilename)
  fs.writeFileSync(filePath, buffer, { flag: 'wx' })

  const url = `/uploads/${safeFilename}`
  res.json({ url })
}

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }
}
